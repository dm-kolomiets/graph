{
  "use strict"

  // range slider initialization
  let slider = document.getElementById("storage")
  let slider2 = document.getElementById("transfer")

  noUiSlider.create(slider, {
    start: 0,
    connect: "lower",
    step: 1,
    range: {
      min: 1,
      max: 1000,
    },
    pips: {
      mode: "values",
      values: [0, 1000],
      density: 1,
    },
  })

  noUiSlider.create(slider2, {
    start: 0,
    connect: "lower",
    step: 1,
    range: {
      min: 1,
      max: 1000,
    },
    pips: {
      mode: "values",
      values: [0, 1000],
      density: 1,
    },
  })
  // end range slider initialization

  // Display the slider value
  let storageValue = document.getElementById("storageValue")
  let transferValue = document.getElementById("transferValue")

  let storageNum
  let transferNum

  slider.noUiSlider.on("update", function (values, handle) {
    const sliderVal = parseInt(values[handle])

    storageNum = sliderVal
    storageValue.innerHTML = `${sliderVal} GB`
    calculateVal(storageNum, transferNum)
  });

  slider2.noUiSlider.on("update", function (values, handle) {
    const sliderVal = parseInt(values[handle])

    transferNum = sliderVal
    transferValue.innerHTML = `${parseInt(values[handle])} GB`
    calculateVal(storageNum, transferNum)
  });
  // End Display the slider value

  // calculate Value
  function calculateVal(storageValue = 1, transferValue = 1) {
    const storageItem = document.querySelectorAll(".graph__item")

    const arrNum = []
    storageItem.forEach((val) => {
      // getting values
      const min = +val.getAttribute("data-min")
      let storage = +val.getAttribute("data-storage")
      const transfer = +val.getAttribute("data-transfer")
      const max = +val.getAttribute("data-max")
      const storageHdd = +val.getAttribute("data-storageHdd")
      const storageSsd = +val.getAttribute("data-storageSsd")
      const storageMulti = +val.getAttribute("data-storageMulti")
      const storageSingle = +val.getAttribute("data-storageSingle")
      const free = +val.getAttribute("data-free")
      const checkboxName = val.getAttribute("data-checkbox")

      if (storageHdd && storageSsd && checkboxName === "hdd") {
        storage = storageHdd
      } else if (checkboxName === "ssd") {
        storage = storageSsd
      }

      if (storageMulti && storageSingle && checkboxName === "multi") {
        storage = storageMulti
      } else if (checkboxName === "single") {
        storage = storageSingle
      }

      let result = (storage * storageValue + transfer * transferValue).toFixed(
        1
      );

      if (storageValue < free && transferValue < free) {
        result = (0).toFixed(2)
      } else if (storageValue > free && transferValue > free) {
        result = (result - (storage * free + transfer * free)).toFixed(2)
      }

      if (min && result < min) {
        result = min.toFixed(2)
      } else if (max && result > max) {
        result = max.toFixed(2)
      }

      // graph construction
      const progress = (100 * result) / 100
      val.querySelector(".progress").style.width = `${progress}%`

      function resize() {
        if (window.innerWidth < 576) {
          val.querySelector(".progress").style.width = `${20}px`
          val.querySelector(".progress").style.height = `${progress}vw`
        } else {
          val.querySelector(".progress").style.width = `${progress}%`
          val.querySelector(".progress").style.height = `${20}px`
        }
      }
      resize()

      window.addEventListener(
        "resize",
        function (event) {
          resize()
        },
        true
      )

      // record the result
      val.querySelector(".progress__value i").innerHTML = result
      val.setAttribute("data-result", result)

      arrNum.push(val.querySelector(".progress__value i").textContent)
    })

    // checking color
    const minValue = Math.min(...arrNum)

    storageItem.forEach((element) => {
      const checkColor = element.getAttribute("data-color")
      const attr = +element.getAttribute("data-result")

      if (minValue === attr) {
        element.querySelector(".progress").style.background = checkColor
      } else {
        element.querySelector(".progress").style.background = "grey"
      }
    });
    // end checking color
  }
  // end calculate Value

  // checking checkbox
  const checkbox = document.querySelectorAll(".toggle__block")
  let checkboxName

  checkbox.forEach(function (checkitem) {
    let attr = checkitem.getAttribute("id")
    checkitem.addEventListener("change", (event) => {
      checkboxName = attr
      checkitem
        .closest(".graph__item")
        .setAttribute("data-checkbox", checkboxName)

      const getStorage = parseInt(slider.noUiSlider.get())
      const getTransfer = parseInt(slider2.noUiSlider.get())
      calculateVal(getStorage, getTransfer)
    })
  })
  // end checking checkbox
}
