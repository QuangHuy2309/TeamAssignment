export function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function checkDate(dateString, dob) {
  var joinedDate = new Date(dateString);
  var birthDate = new Date(dob);
  var age = joinedDate.getFullYear() - birthDate.getFullYear();
  var m = joinedDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && joinedDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}

export function checkWeekend(dateString) {
  var date = new Date(dateString);
  return date.getDay() === 0 || date.getDay() === 6;
}

export function checkName(name) {
  var pattern = /^[a-zA-Z\s]*$/;
  return name.length > 0 && pattern.test(name);
}

export function dateConvert(date) {
  if (typeof date !== "undefined") {
    const dateList = date.split("-");
    let dateConvert = `${dateList[2]}/${dateList[1]}/${dateList[0]}`;
    return dateConvert;
  }
}

export function checkAssetName(name) {
  var pattern = /^[a-zA-Z0-9\s]*$/;
  return name.length > 0 && pattern.test(name);
}

export function convertToday() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  return today;
}
