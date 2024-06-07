import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listingController.js'
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
// router.delete('/delete/:id', verifyToken, deleteListing);
router.delete('/delete/:id', deleteListing);
router.post('/update/:id', verifyToken, updateListing);

//This will get the data of an Individual listing
// router.get('/get/:id', verifyToken, getListing);
router.get('/get/:id', getListing);

//Multiple listings
router.get('/get', getListings)

export default router;