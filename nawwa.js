//imoprting dependencies
const Joi = require('joi'); // changed from require('Joi')
const express = require('express');

//making a object of Express
const app = express();

//we need this json onbjec
app.use(express.json());

//in memory arry of data
const courses =[{id:1,name:'couser1'},{id:2,name:'couser2'},{id:3,name:'couser3'}]

//read all
app.get('/api/courses',(req, res)=>{
    console.log(`[GET] /api/courses - request received`);
    res.send(courses)
    console.log(`[GET] /api/courses - success: returned ${courses.length} courses`);    
});

//read by id
app.get('/api/courses/:id',(req, res)=>{
    const id = parseInt(req.params.id);
    console.log(`[GET] /api/courses/${id} - request received`);
    
    //looking up the course if not existing, return 404
    const course = courses.find(c=>c.id===id);
    if (!course){
        console.log(`[GET] /api/courses/${id} - fail: not found`);
        res.status(404).send('the couser is not availabale on our caterlog')
    }
    else {
        console.log(`[GET] /api/courses/${id} - success: returned course`);
        res.send(course)
    }
   
});


//creat by body data
app.post('/api/courses',(req, res)=>{
    console.log(`[POST] /api/courses - request received with body: ${JSON.stringify(req.body)}`);
    const {error} = validateCourse(req.body)
     if (error) {
         console.log(`[POST] /api/courses - fail: validation error - ${error.details[0].message}`);
         return res.status(400).send(error.details[0].message);
     }
       
    const course= {
        id:courses.length +1,
        name:req.body.name
        };
    courses.push(course);
    console.log(`[POST] /api/courses - success: created course id ${course.id}`);
    res.send(course);

});


//update by boday data
app.put('/api/courses/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    console.log(`[PUT] /api/courses/${id} - request received with body: ${JSON.stringify(req.body)}`);

    //looking up the course if not existing, return 404
    const course = courses.find(c=>c.id===id);
    if (!course) {
        console.log(`[PUT] /api/courses/${id} - fail: not found`);
        return res.status(404).send('the couser is not availabale on our caterlog')
    }
   
    
    //using object distrcution
    const {error} = validateCourse(req.body)
     if (error) {
         console.log(`[PUT] /api/courses/${id} - fail: validation error - ${error.details[0].message}`);
         return res.status(400).send(error.details[0].message);
     }
    
    //update course and returen the course
    course.name = req.body.name
    console.log(`[PUT] /api/courses/${id} - success: updated course name to "${course.name}"`);
    res.send(course)
});
 
 
//delete by id
app.delete('/api/courses/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    console.log(`[DELETE] /api/courses/${id} - request received`);

    //looking up the course if not existing, return 404
    const course = courses.find(c=>c.id===id);
    if (!course){
        console.log(`[DELETE] /api/courses/${id} - fail: not found`);
        return res.status(404).send('the couser is not availabale on our caterlog');
    }

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1);

    console.log(`[DELETE] /api/courses/${id} - success: deleted course`);
    //Return the response
    res.send(courses)

});

//creteing a port
const port = process.env.PORT || 4000
app.listen(port,()=>{
    console.log(`listing to the port ${port}...`);
    console.log(`[SERVER] listening on port ${port}`);
});


//validation fuction which uses the joi
function validateCourse(course){
    const schema={
        name :Joi.string().min(3).required()
    } 
    return Joi.validate(course,schema);

}