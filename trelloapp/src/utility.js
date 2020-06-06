
const autoFocus = (itemRef) => {
    itemRef.current.focus();
  };


// isoDate in Mongo: 2020-05-21T10:44:02.623+00:00
const createDateTime = (isoDate)=>{
 let splited = isoDate.split(".");
//  console.log("splited", splited[0]); //["2020-05-21T10:44:02", "623+00:00"]
 let splited2= splited[0].split("T");
//  console.log("splited2", splited2); //["2020-05-21", "10:44:02"]
 let splited3 = splited2[1].split(":", 2);
//  console.log("splited3", splited3); // ["10", "44"]
 let dateTime = splited2[0]+" "+splited3[0]+":"+splited3[1];
//  console.log("dateTime", dateTime);
 return dateTime;
}




export {autoFocus, createDateTime};