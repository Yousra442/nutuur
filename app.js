const fs = require ('fs');
const express= require ('express');
const app =express()
const morgan= require('morgan');
app.use(morgan('tiny'));
app.use(express.json())
const alltoursa=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
const getalltours=(req,res)=>{
    res.status(200).json({
        status:"sucess",
        data:{
            alltoursa
        }
    })}
    const gettour=(req,res)=>{
        const id=req.params.id *1;
        const tour =alltoursa.find(el=>el.id === id);
        res.status(200).json({
            stat:'sucuss',
        data:{
            tour
        }    })
    }
    const posttour=(req,res)=>{
        const newtourid=alltoursa[alltoursa.length -1].id + 1;
        const newtour=Object.assign({id:newtourid},req.body)
        alltoursa.push(newtour)
        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(alltoursa),err=>{
            res.status(201).json({
                status:'sussed',
                data:{
                newtour
                }
            })
        })
    }
    const patchtour=(req, res) => {
        const id = req.params.id * 1;
        const tourIndex = alltoursa.findIndex(el => el.id === id);
    
        if (tourIndex === -1) {
            return res.status(404).json({
                status: 'fail',
                message: 'Tour not found'
            });
        }
    
        const updatedTour = Object.assign({}, alltoursa[tourIndex], req.body);
        alltoursa[tourIndex] = updatedTour;
    
        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(alltoursa), err => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not update tour'
                });
            }
            res.status(200).json({
                status: 'success',
                data: {
                    tour: updatedTour
                }
            });
        });
    }
 const delettour=(req, res) => {
    const id=req.params.id *1;
  const tourIndex=alltoursa.findIndex(el=>el.id===id)
  alltoursa.splice(tourIndex,1)
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(alltoursa), err => {
  res.status(204).json({
      status:"sucess",
      data:null
  })
  })
  }   
  const tourrouter=express.Router();
app.use('/api/v1/tours',tourrouter)
 



tourrouter.route('/').get(getalltours).post(posttour)
tourrouter.route('/:id').get(gettour).patch(patchtour).delete(delettour)


const port=3000;
app.listen(port,()=>{
    console.log('done');
    
})