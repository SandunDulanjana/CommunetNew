import annouceModel from"../models/annoucementModel.js";

// insert

const addannoucemnt = async(req,res)=>{

    try{

        const {Type,discription,audience}=req.body;

        if(!Type||!discription||!audience){

            return res.json({success:false,message:"missing details"});
        }

        const annoucementData={

            Type,
            discription,
            date:Date.now(),
            audience
        }

        const newannoucement= new annouceModel(annoucementData);
        await  newannoucement.save();
        
        res.json ({success:true,message:"Add Annoucement Sucessfuly "});





    }catch(error){

        console.log(error);
        res.json({success:false,message:error.message});


    };
    
    
}
// read
const displayAllAnnoucemnts =  async(req,res) => {
    try{
        const AllAnnoucemnts = await annouceModel.find()
        return res.status(200).json({ success: true, AllAnnoucemnts });

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

const displayAnnoucemnt = async (req, res) => {
    try {
        const AnnoucemntAudience = req.params.audience;
        const Annoucemnt = await annouceModel.find({ audience: AnnoucemntAudience });

        return res.status(200).json({ success: true, Annoucemnt });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAnnoucement=async(req,res)=>{
    try{

    const annoucementId=req.params.id;
         
    await annouceModel.findByIdAndDelete(annoucementId);

    return res.json({success: true, message:"Annoucement Delete"})


    }catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }


}


const updateAnnoucement=async(req,res)=>{

    try{

        const annoucementId= req.params.id;

        const {Type,discription,audience}=req.body;

        if(!Type||!discription||!audience){

            return res.json({success:false,message:"missing details"});
        }
        await annouceModel.findByIdAndUpdate(annoucementId,{$set:{Type,discription,audience}})
        res.json({success: true, message:"Annoucement Update Success"})




    }catch(error){

        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export{addannoucemnt,displayAllAnnoucemnts,displayAnnoucemnt,deleteAnnoucement,updateAnnoucement}

