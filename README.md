# ember-cli-daterangepicker

[![Build Status](https://travis-ci.org/josemarluedke/ember-cli-daterangepicker.svg?branch=master)](https://travis-ci.org/josemarluedke/ember-cli-daterangepicker)

Just a simple component to use [daterangepicker](https://github.com/dangrossman/daterangepicker).

## Installation

```
ember install ember-cli-daterangepicker
```

## Usage

```handlebars
{{date-range-picker
  label='Optional label'
  start="20150101"
  end="20151231"
  applyAction=(action "setDateRange")
  hideAction=(action "hideDatePicker")
  cancelAction=(action "cancelDatePicker")
}}
```

This addon supports many of the same options as the [daterangepicker](https://github.com/dangrossman/daterangepicker) library. These options are documented here: [http://www.daterangepicker.com/#options](http://www.daterangepicker.com/#options). Open up an issue if you find an option that does not work with this addon.

`applyAction`, `hideAction`, and `cancelAction` will bubble up to the named function on nearest controller, etc, like normal. All are optional, but you won't have any way to get your date if you don't specify an `applyAction`.

## Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Contributing

1. [Fork it](https://github.com/josemarluedke/ember-cli-daterangepicker/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


# License

Copyright (c) 2015-2017 Josemar Luedke

Licensed under the [MIT license](LICENSE.md).
