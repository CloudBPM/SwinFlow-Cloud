$(function ($)
{
  var month = {
    "number": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    "short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "long": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  },
  today = new Date(), 
  todayYear = today.getFullYear(),
    todayMonth = today.getMonth() + 1,
    todayDay = today.getDate();
    updateTheBirthDayValue = function(options, $selector, selectedYear, selectedMonth, selectedDay) {
      if ((selectedYear * selectedMonth * selectedDay) != 0) {
        if (selectedMonth<10) selectedMonth="0"+selectedMonth;
        if (selectedDay<10) selectedDay="0"+selectedDay;
        hiddenDate = selectedYear + "-" + selectedMonth + "-" + selectedDay;
        $selector.val(hiddenDate);

        if (options.callback) {
          options.callback(hiddenDate);
        }
      }
    }
    generateBirthdayPicker = function ($parent, options) 
    {
      var parentId = $parent.attr('id').replace(/-/g, '');

      // Create the html picker skeleton
        var $fieldset = $(".birthdayPicker"),
          $year = $("select[name='birth[year]']"),
            $month = $("select[name='birth[month]']"),
            $day = $("select[name='birth[day]']"),
            $birthday = $("input[name='birthDay']");

      //calculate the year to add to the select options. 
      var yearBegin = todayYear - options.minAge; 
      var yearEnd = todayYear - options.maxAge;
      if (options.maxYear != todayYear && options.maxYear > todayYear) {
        yearBegin = options.maxYear; 
        yearEnd = yearEnd + (options.maxYear - todayYear)
      }
      for (var i = yearBegin; i >= yearEnd; i--) { 
        $("<option></option>").attr("value", i).text(i).appendTo($year); 
      }
      for (var i = 0; i <= 11; i++) {
        $("<option></option>").attr('value', i + 1).text(month[options.monthFormat][i]).appendTo($month);
      }
      for (var i = 1; i <= 31; i++) {
        var number = (i < 10) ? "0"+i: i;
        $("<option></option>").attr('value', i).text(number).appendTo($day);
      }

        $fieldset.append($birthday);
        $parent.append($fieldset);
        // Set the default date if given
        if (options.defaultDate) {
          var date = new Date(options.defaultDate);
          $year.val(date.getFullYear());
          $month.val(date.getMonth() + 1);
          $day.val(date.getDate());
          updateTheBirthDayValue(options, $birthday, date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
    
        $fieldset.on('change', function () 
        {
          // currently selected values
            selectedYear = parseInt($year.val(), 10),
            selectedMonth = parseInt($month.val(), 10),
            selectedDay = parseInt($day.val(), 10);
            //rebuild the index for the month. 
            var currentMaxMonth = $month.children(":last").val();
            if (selectedYear > todayYear) {
              if (currentMaxMonth > todayMonth) {
                while (currentMaxMonth > todayMonth) {
                  $month.children(":last").remove();
                  currentMaxMonth--;
                } 
              } 
            } else {
              while (currentMaxMonth < 12) {
                $("<option></option>").attr('value', parseInt(currentMaxMonth)+1).text(month[options.monthFormat][currentMaxMonth]).appendTo($month);
                currentMaxMonth++;
              }
            }

            var currentMaxDate = $day.children(":last").val(); 
            // number of days in currently selected year/month
            var actMaxDay = (new Date(selectedYear, selectedMonth, 0)).getDate();
            if (currentMaxDate > actMaxDay) {
              while (currentMaxDate > actMaxDay) {
                $day.children(":last").remove(); 
                currentMaxDate--;
              }
            } else if (currentMaxDate < actMaxDay ) {
              while (currentMaxDate < actMaxDay) 
              {
                var dateIndex = parseInt(currentMaxDate) + 1; 
                var number = (dateIndex < 10) ? "0"+dateIndex: dateIndex;
            $("<option></option>").attr('value', dateIndex).text(number).appendTo($day);
                currentMaxDate++;
              }
            }
            // update the hidden date
            updateTheBirthDayValue(options, $birthday, selectedYear, selectedMonth, selectedDay);
        });
    }

    $.fn.birthdayPicker = function(options) 
  {
    return this.each(function () {
          var settings = $.extend($.fn.birthdayPicker.defaults, options );
          generateBirthdayPicker($(this), settings);
    });
  };

  $.fn.birthdayPicker.defaults = {
      "maxAge"        : 100,
        "minAge"        : 0,
        "maxYear"       : todayYear,
        "dateFormat"    : "middleEndian",
        "monthFormat"   : "number",
        "placeholder"   : true,
        "defaultDate"   : false,
        "sizeClass"   : "span2",
        'callback': false
  } 
}( jQuery ))