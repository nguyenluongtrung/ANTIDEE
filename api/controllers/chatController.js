const chatting = require('../models/chatModel');

//get All chat
const getAllChats = async (req, res) => {
    const chat = await chatting.find({});
  
    res.status(200).json({
      status: "success",
      data: {
        chat,
      },
    });
  };

//createChat
const createChat = async (req, res) => {
 try {
    const chat = await chatting.create(req.body);
    res.status(201).json({
        success: true,
        data:{chat},
    });
    
 } catch (error) {
    res.status(400).json({
        success:false,
        error: error.message,
    })
 }
}

//find chat

const getChatById = async(req, res)=>{
    try {
        const chat = await chatting.findById(req.params.chatId);

        if(!chat){
            return res.status(404).json({
                success:false,
                error:"Chat not found"
            });
        }
        res.status(200).json({
            success:true,
            data:chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
          });
    }
}
module.exports = {
    getAllChats,
    createChat,
    getChatById
}