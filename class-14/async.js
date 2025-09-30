const value1 = new Promise((resolve, reject) => {
  reject("Tutorial");
});

const value2 = "Tutorial";

async function fetchValue() {
  return value1;
}

const value = fetchValue();
value.catch((data) => console.log(data));
