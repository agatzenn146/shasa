
const path = require('path');
const Employees = require('../models/events');
const employee = require('../models/events');



/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
     try {
    const limitNumber = 1;
    const latest = await employee.find({}).sort({_id: -1}).limit(limitNumber);
    const eventsHomepage = await employee.find({  'employee':'employee' }).limit(limitNumber);
   

    const churchActivities = { eventsHomepage, latest };

         res.render('index', { title: 'Southern Highlands Adventist Student Ministry - Home', eventsHomepage, churchActivities } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }

    

   
   
    
  }

  /**
 * GET /
 * messages 
*/
exports.messages = async(req, res) => {
   
    res.render('messages', { title: 'Sam Agbamuche Ministry - Messages' } );
  
}



// library
exports.library = async(req, res) => {
   
    res.render('library', { title: 'Sam Agbamuche Ministry - Admin-library-post' } );
  
}

  /**
 * GET /
 * events
*/
exports.events = async (req, res) => {
     try {
    const limitNumber = 3;
    const myEvents = await Employees.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('events', { title: 'Sam Agbamuche Ministry - events', myEvents }  );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


  /**
 * GET /
 *register 
*/
exports.register = async(req, res) => {
   
    res.render('register', { title: 'Sam Agbamuche Ministry - register' } );
  
}

// dashboard
exports.dashboard = async(req, res) => {
   
    res.render('admin/dashboard', { title: 'Sam Agbamuche Ministry - Admin-Dashboard' } );
  
}

// messages
exports.adminMessages = async(req, res) => {
   
    res.render('admin/new-messages', { title: 'Sam Agbamuche Ministry - Admin-message-post' } );
  
}

// library
exports.adminLibrary = async(req, res) => {
   
    res.render('admin/new-lib', { title: 'Sam Agbamuche Ministry - Admin-library-post' } );
  
}


// rhema
exports.adminRhema = async(req, res) => {
   
    res.render('admin/new-rhema', { title: 'Sam Agbamuche Ministry - Admin-rhema-post' } );
  
}



//  new events
exports.adminEvents = async(req, res) => {
   
    res.render('admin/new-events', { title: 'Sam Agbamuche Ministry - Admin events post' } );
  
}

//  view events
exports.viewEvents = async(req, res) => {
   
    let searchQuery = {_id : req.params.id};
   await Employees.findOne(searchQuery)
        .then(employee => {
            res.render('admin/view-events', {  title: 'Sam Agbamuche Ministry - Admin View Event ', employee: employee });
                
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/admin/dashboard');
         
        });
  
}

// get all events
exports.allEvents = async (req, res) => {
   await Employees.find({})
        .then(employees => {
            res.render('admin/all-events', { title: 'Sam Agbamuche Ministry - Admin all events ', employees: employees });
        }).catch(err=> {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/admin/dashboard');
        })
   

  
}




//post new here
exports.adminNewEvents = async(req, res) => {
    try{
        let imageUploadFile;
        let uploadPath;
        let newImageName;
    
        if(!req.files || Object.keys(req.files).length === 0){
          console.log('No Files where uploaded.');
       
        } else {
    
          imageUploadFile = req.files.image;
          newImageName = Date.now() +"_"+ imageUploadFile.name;
    
          uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
    
          imageUploadFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);
          })
    
        }

     let newEvents = new employee ( {
         name : req.body.name,
         evdate : req.body.evdate,
         time : req.body.time,
         image : newImageName,
         description : req.body.description
     });

      await newEvents.save();

     req.flash('success_msg', 'Data added to DB sucessfully.')
        res.redirect('/admin/new-events');
     

    //  Employee.create(newEmployee)
    //      .then(employee => {
    //          req.flash('success_msg', 'Employee data added to database successfully.')
    //          res.redirect('/');
    //      })

    }catch (err) {
        req.flash('error_msg', 'ERROR: ' + err)
        console.log('error')
        res.redirect('/admin/new-events');
      
        };
};

// get  edit events
exports.editEvents = async (req, res) => {


    let searchQuery = {_id : req.params.id};
   await Employees.findOne(searchQuery)
        .then(employee => {
            res.render('admin/edit-events', {  title: 'Sam Agbamuche Ministry - Admin Edit Events ', employee: employee });
                
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/admin/dashboard');
         
        });

};



exports.editPostEvents = async (req, res) => {
    // try{
        let imageUploadFile;
        let uploadPath;
        let newImageName;
    
        if(!req.files || Object.keys(req.files).length === 0){
          console.log('No Files where uploaded.');
       
        } else {
    
          imageUploadFile = req.files.image;
          newImageName = Date.now() +"_"+ imageUploadFile.name;
    
          uploadPath = require('path').resolve('./') + '/public/uploads' + newImageName;
    
          imageUploadFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);
          })
    
        }

    let searchQuery = {_id : req.params.id};

    Employees.updateOne(searchQuery, {$set: {
        name : req.body.name,
         evdate : req.body.evdate,
         time : req.body.time,
         image : newImageName,
         description : req.body.description
       
    }
    })
        .then( employee => {
        req.flash('success_msg', 'Event updated successfully.')
        res.redirect('/admin/all-events');
     }).catch ( err => {
        req.flash('error_msg', 'ERROR: '+err)
        res.redirect('/admin/all-events');
    });
};



//delete routes starts here
exports.deleteEvent = (req, res) => {
    let searchQuery = {_id : req.params.id};

    Employees.deleteOne(searchQuery)
        .then(employee=>{
            req.flash('success_msg', 'Event deleted successfully.')
            res.redirect('/admin/all-events');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/admin/all-events');
        });
};
//delete routes ends here