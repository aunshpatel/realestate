import Listing from "../../models/listingModel.js";
import errorHandler from "../utils/error.js";

export const createListing = async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)
    } catch (error) {
      next(error);  
    }
}

export const deleteListing = async(req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing){
    return next(errorHandler(404, 'Listing not found!'));
  }
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401, 'You can only delete your own listing'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted');
  } catch (error) {
    next(error)
  }
}

export const updateListing = async(req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing){
    return next(errorHandler(404, 'Listing not found!'));
  }
  if(req.user.id !== listing.userRef){
    return next(errorHandler(401, 'You can only delete your own listing'));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
}

//Single listing
export const getListing = async(req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);

  } catch (error) {
    
  }
}


//Multiple listings
export const getListings = async(req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let discount = req.query.discount;
    if(discount === undefined || discount === 'false'){
      discount = { $in:[false, true] };
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'DefaultValue'){
      furnished = { $in:['SemiFurnished', 'Unfurnished', 'Furnished'] };
    }

    if(furnished === 'SemiFurnished'){
      furnished = { $in:['SemiFurnished'] };
    }
    if(furnished === 'Furnished'){
      furnished = { $in:['Furnished'] };
    }
    if(furnished === 'Unfurnished'){
      furnished = { $in:['Unfurnished'] };
    }

    let type = req.query.type;
    if(type === undefined || type === 'all') {
      type = { $in:['sell', 'rent'] }
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      discount,
      furnished,
      type
    }).sort({[ sort]: order }).limit(limit).skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}