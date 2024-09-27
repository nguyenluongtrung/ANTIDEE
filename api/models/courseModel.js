const mongoose = require('mongoose');
const { Schema } = mongoose;
 
const lessonSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  content: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    required:true 
}],  
  description: { 
    type: String 
},
  createdDate: { 
    type: Date, 
    default: Date.now 
},
  updatedDate: { 
    type: Date, 
    default: Date.now 
}
});
 
const courseSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
    },
  description: { 
    type: String 
},
  duration: { 
    type: Number, 
    required: true 
},  
  qualificationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Qualification', 
    required: true 
},
  lessons: [{ 
    type: lessonSchema, 
    required: true 
}],  
  image: {
     type: String 
    },
  createdDate: { 
    type: Date, 
    default: Date.now 
},
  updatedDate: { 
    type: Date, 
    default: Date.now 
}
});

module.exports = mongoose.model('Course', courseSchema);
