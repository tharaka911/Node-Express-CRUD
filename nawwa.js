//imoprting dependencies
const Joi = require('Joi');
const express = require('express');

//making a object of Express
const app = express();

//we need this json onbjec
app.use(express.json());

//in memory arry of data
const courses =[{id:1,name:'couser1'},{id:2,name:'couser2'},{id:3,name:'couser3'}]

//read all
app.get('/api/courses',(req, res)=>{
    res.send(courses)
    
});

//read by id
app.get('/api/courses/:id',(req, res)=>{
    
    //looking up the course if not existing, return 404
    const course = courses.find(c=>c.id===parseInt(req.params.id));
    if (!course){res.status(404).send('the couser is not availabale on our caterlog')}
    else {res.send(course)}
   
});


//creat by body data
app.post('/api/courses',(req, res)=>{
    const {error} = validateCourse(req.body)
     if (error) return res.status(400).send(error.details[0].message);
       
    

    const course= {
        id:courses.length +1,
        name:req.body.name
        };
    courses.push(course);
    res.send(course);

});


//update by boday data
app.put('/api/courses/:id',(req,res)=>{

    //looking up the course if not existing, return 404
    const course = courses.find(c=>c.id===parseInt(req.params.id));
    if (!course) return res.status(404).send('the couser is not availabale on our caterlog')
   
    
    //validate and if invadidate retuen 400 -bad request
    // const result = validateCourse(req.body)
    // if (result.error){
    //     res.status(400).send(result.error.details[0].message);
    //     return;
    // }

    //using object distrcution
    const {error} = validateCourse(req.body)
     if (error) return res.status(400).send(error.details[0].message);
    
    //update course and returen the course
    course.name = req.body.name
    res.send(course)
});
 
 
//delete by id
app.delete('/api/courses/:id',(req,res)=>{

    //looking up the course if not existing, return 404
    const course = courses.find(c=>c.id===parseInt(req.params.id));
    if (!course){res.status(404).send('the couser is not availabale on our caterlog')};

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);

    //Return the response
    res.send(courses)

});

//creteing a port
const port = process.env.PORT || 4000
app.listen(port,()=>{console.log(`listing to the port ${port}...`)});


//validation fuction which uses the joi
function validateCourse(course){
    const schema={
        name :Joi.string().min(3).required()
    } 
    return Joi.validate(course,schema);

}