import express, { response } from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { request } from 'http';

const app:express.Application=express();  //we are specifing  that this is express application

const hostname : String = 'localhost';
const port : number = 5000;

const dbFile = 'db.json';

// Create the db.json file if it doesn't exist
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, '[]');
    console.log('file created');
  }
  

//configure express to received form data
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.get('/ping', (request:express.Request, response:express.Response)=>{
    response.status(200).json({ result: true });
});


//submit request  for  saving the data 

app.post('/submit',(request:express.Request, response:express.Response)=>{

    const{name, email, phone, github_link,stopwatch_time}=request.body;

    // Validate the input data
  if (!name ||!email ||!phone ||!github_link ||!stopwatch_time) {
    return response.status(400).json({ error: 'Please fill in all the fields' });
  }

  //initialization of new json obj
  const formData: {
    name: string;
    email: string;
    phone: string;
    github_link: string;
    stopwatch_time: string;
  } = {
    name: request.body.name,
    email: request.body.email,
    phone: request.body.phone,
    github_link: request.body.github_link,
    stopwatch_time: request.body.stopwatch_time,
  };

  const data = fs.readFileSync(dbFile);
  const jsonData = JSON.parse(data.toString());

  jsonData.push(formData);

  fs.writeFileSync(dbFile, JSON.stringify(jsonData));

  response.status(201).json({ message: 'Form data submitted successfully' });

});

//read endpoint to return json obj at that given index in responce

app.get('/read',(request:express.Request, response:express.Response)=>{
  console.log("step 1 pass");
  //const idx:string= request.query.index;

    //const index:number =parseInt(request.query.index);
    //const index = typeof request.query.index === 'tring'? parseInt(request.query.index, 10) : undefined;
    const index = parseInt(request.query.index as string, 10);
    console.log(request.query.index)
    //checking the  number is int or not
    if(isNaN(index))
        {
            response.status(400).json({ error: 'Invalid index' });
            return;
        }
    console.log("step 2 pass")
        //reading json file from db.json and storing it  at dbdata which is of any[]  which specifies result 
        //will have values of  'any' type  array  and fs is node js module which have readfilesyc method
        //which reads the entire content of file return buffer decode with utf-8
        const dbData: any[] = JSON.parse(fs.readFileSync(dbFile, 'utf8'))
        console.log("step 3 pass")
        if (index >= dbData.length) {
            response.status(404).json({ error: 'Index out of bounds' });
            return;
          }
          console.log("step 4 pass")
          const dataAtIndex: any = dbData[index];
          response.status(200).json(dataAtIndex);
          console.log("step 5 pass ")
});


app.get('/delete',(request:express.Request, response:express.Response)=>{
  console.log("step 1 pass");
  //const idx:string= request.query.index;

    //const index:number =parseInt(request.query.index);
    //const index = typeof request.query.index === 'tring'? parseInt(request.query.index, 10) : undefined;
    const index = parseInt(request.query.index as string, 10);
    console.log(request.query.index)
    //checking the  number is int or not
    if(isNaN(index))
        {
            response.status(400).json({ error: 'Invalid index' });
            return;
        }
    console.log("step 2 pass")
    const data = fs.readFileSync(dbFile);
    const jsonData = JSON.parse(data.toString());

    jsonData.splice(index, 1);
    fs.writeFileSync(dbFile, JSON.stringify(jsonData));

    response.status(201).json({ message: 'Form data Deleted successfully' });
});





//configure for call back
app.listen(port, ()=>{
    console.log('server started on port 5000');
});
