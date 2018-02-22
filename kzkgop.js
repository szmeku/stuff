var querySelectorAll = _.curryN(2, (selector, el) => Array.from(el.querySelectorAll(selector))),
    querySelector = _.curryN(2, (selector, el) => el.querySelector(selector)),
    text = _.compose(
        _.replace(/\s{2,}/g, ''),
        _.trim,
        _.prop('textContent')
    ),

    // retrieveSubSchedules = (el) => Array.from(el.querySelectorAll('.panel')).map(retrieveSubSchedule),
    retrieveSchedules = _.compose(
        _.objOf('schedules'),
        _.map(_.compose(
            _.mergeAll,
            _.juxt([
                _.compose(_.objOf('lineNumber'), text, querySelector('.btn-primary')),
                _.compose(
                    _.objOf('arrivalTimes'),
                    _.map(_.compose(
                        _.mergeAll,
                        _.juxt([
                            _.compose(
                                _.objOf('dayType'),
                                text,
                                querySelector('.panel-heading .panel-title')
                            ),
                            _.compose(
                                _.objOf('times'),
                                _.map(_.compose(
                                    _.mergeAll,
                                    _.juxt([
                                        _.compose(_.objOf('hour'), text, _.nth(0), _.prop('childNodes')),
                                        _.compose(_.objOf('min'), text, _.nth(1), _.prop('childNodes'))
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
    );


JSON.stringify(retrieveSchedules(document));
