import rulesModel from "../models/rulesModel.js";



// insert

const addrules = async(req,res)=>{

    try{

        const {Rule_subject,discription}=req.body;

        if(!Rule_subject||!discription){

            return res.json({success:false,message:"missing details"});
        }

        const rulesData={

            Rule_subject,
            discription,
            date:Date.now(),
            
        }

        const newrules= new rulesModel(rulesData);
        await  newrules.save();
        
        res.json ({success:true,message:"Add new rule Sucessfuly "});





    }catch(error){

        console.log(error);
        res.json({success:false,message:error.message});


    }
};

// read
const displayrules =  async(req,res) => {
    try{
        const Allrules = await rulesModel.find()
        return res.status(200).json({ success: true,Allrules  });

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}



//delete


const deleterules = async (req, res) => {
    try {
        const ruleId = req.params.id;

        // Check if rule exists before deleting
        const rule = await rulesModel.findById(ruleId);
        if (!rule) {
            return res.status(404).json({ success: false, message: "Rule not found" });
        }

        await rulesModel.findByIdAndDelete(ruleId);
        return res.json({ success: true, message: "Rule deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//update
const updaterule = async(req,res)=>{

    try{

        const ruleId= req.params.id;

        const {Rule_subject,discription}=req.body;

        if(!Rule_subject||!discription){

            return res.json({success:false,message:"missing details"});
        }
        await rulesModel.findByIdAndUpdate(ruleId,{$set:{Rule_subject,discription}})
        res.json({success: true, message:"rule Update Success"})




    }catch(error){

        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export{addrules,displayrules,deleterules,updaterule}




