var querySelectorAll = _.curryN(2, (selector, el) => Array.from(el.querySelectorAll(selector))),
    querySelector = _.curryN(2, (selector, el) => el.querySelector(selector)),
    text = _.compose(
        _.replace(/\s{2,}/g, ''),
        _.trim,
        _.prop('textContent')
    ),

    // retrieveSubSchedules = (el) => Array.from(el.querySelectorAll('.panel')).map(retrieveSubSchedule),
    retrieveSchedules = _.compose(
        _.map(_.compose(
            _.mergeAll,
            _.juxt([
                _.compose(_.objOf('lineNumber'), text, querySelector('.btn-primary')),
                _.compose(
                    _.objOf('subSchedules'),
                    _.map(_.compose(
                        _.mergeAll,
                        _.juxt([
                            _.compose(
                                _.objOf('name'),
                                text,
                                querySelector('.panel-heading .panel-title')
                            ),
                            _.compose(
                                _.objOf('arrivalTimes'),
                                _.map(_.compose(
                                    _.mergeAll,
                                    _.juxt([
                                        _.compose(_.objOf('hour'), text, _.nth(0), _.prop('childNodes')),
                                        _.compose(
                                            _.objOf('mins'),
                                            _.map(_.compose(text, _.nth(0), _.prop('childNodes'), _.nth(1), _.prop('childNodes'))),
                                            querySelectorAll('sup'))
                                    ])
                                )),
                                querySelectorAll('.panel-body .arrival-time')
                            )
                        ])
                    )),
                    querySelectorAll('.panel')
                )
            ])
        )),
        querySelectorAll('.container-wide .container'),
    ),

    schedulesByHours = _.pipe(
        retrieveSchedules,
        _.map(_.compose(
            _.apply(_.map),
            _.juxt([
                _.compose(_.assoc('lineNumber'), _.prop('lineNumber')),
                _.compose(
                    _.prop('arrivalTimes'),
                    _.find(_.anyPass([
                        _.propEq('name', 'Robocze- Kursuje w dni robocze przez cały rok'),
                        _.propEq('name', 'Codziennie- Kursuje codziennie przez cały rok')
                    ])),
                    _.prop('subSchedules')
                )
            ])
        )),
        _.flatten,
        _.map(_.compose(
            _.apply(_.map),
            _.juxt([
                _.compose(_.merge, _.pick(['lineNumber', 'hour'])),
                _.compose(_.map(_.objOf('min')), _.prop('mins'))
            ])
        )),
        _.flatten,
        _.sortBy(_.pipe(
            _.props(['hour', 'min']),
            _.join('.'),
            Number
        )),
        _.groupBy(_.prop('hour')),
        _.mapObjIndexed(_.pipe(
                _.pipe(
                    _.map(_.pipe(
                        _.props(['min', 'lineNumber']),
                        _.join(' - ')
                    )),
                    _.join(',')
                ),
        )),
        _.values,
        _.join('\n'),
        console.log
    );

schedulesByHours(document);
