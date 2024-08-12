import { Company } from "../modals/companyModal.js";
import { User } from "../modals/userModal.js";
import getDataUri from "../utils/dataURI.js"
import cloudinary from "../utils/cloudinary.js"
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      res.status(400).json({
        message: "Company name is required...",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });

    if (company) {
      return res.status(400).json({
        message: "You can't register same company...",
        success: false,
      });
    }
    const user = await User.findById(req.id);
    if(user.role==='student'){
      return res.status(400).json({
        message: "You can't register a company",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies) {
      res.status(404).json({
        message: "Companies not found...",
        success: false,
      });
    }
    res.status(200).json({
        companies,
        success:true
    })
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      res.status(404).json({
        message: "Company not found...",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    // cloudinary aayega idhar
    let logo;
    if(typeof req.file !== 'undefined'){
      const fileUri = getDataUri(file)
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const updateData = { name, description, website, location , logo};
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!company) {
      res.status(404).json({
        message: "Company not found...",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
