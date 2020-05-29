const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();

//
app.use(express.urlencoded({extended: true}));// req.params
app.use(express.json()); // req.body
app.use(express.static("public")); // serving public dir

let noteId = "" ;




const getMaxId = () => {
    let max = 0;

    let data = fs.readFileSync("./db/db.json" , "utf8");

    data = JSON.parse(data);

    data.forEach((element,index, data) => {
        if(!element) {

        }else if (element.id > max) max = element.id;
    });
    return max
}






/// all saved notes
app.get("/api/notes", (req,res) =>{
    fs.readFile("./db/db.json", "utf8",(err,data) =>{
        if(err) {
            alert("error Get Notes", err)
            return 0;
        }
        console.log("Data", data);
        // response parsed and returned
        res.json(JSON.parse(data));
        return res;
    } );

});

// post new note
app.post("/api/notes", (req, res) => {
  if(!noteId) noteId = getMaxId();
  noteId +=1;
  req.body.id = noteId; // add id
  fs.readFile("./db/db.json", "utf8" , (err,data) => {
      if(err) {
          alert("Error in posting note")
          return false;
      }else{
          data = JSON.parse(data);
          data = data.concat(req.body);
          data = JSON.stringify(data);
          fs.writeFile("./db/db.json", (data,err) => {
              if(err) {
                  alert("Error in Post")
                  return false;
              }else{
                  res.json(data);
                  return true;
              };
          });
       };
    });
});



app.delete("/api/notes/:id", (req,res) => {
    let id = req.params.id;
    fs.readFile("./db/db.json", "utf8",(err,data) => {
        if(err){
            alert("Error could not READ",err);
            return 0
        }else{
            data = JSON.parse(data);
            data.forEach((element, index, data) => {
                if(element.id == id) {
                    data.splice(index, 1);
                    fs.writeFile("./db/db.json", JSON.stringify(data),err => {
                        if(err) {
                            alert("error on Delete", err);
                            return 0;
                        };
                        res.json(data); 
                    });
                    return 0;
                };
            });
        };
    });
});

///Routes here?

app.listen(PORT, () => {
    console.log(`App is listening on PORT:${PORT}`)
})