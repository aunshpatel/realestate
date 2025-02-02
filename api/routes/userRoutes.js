import express from 'express';
import { updateUser, deleteUser, getUserListings, getUser, getUserByEmail } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);

// router.delete('/delete/:id', verifyToken, deleteUser);
router.delete('/delete/:id', deleteUser);

//The following will get all the listings of a logged in user
// router.get("/listings/:id", verifyToken, getUserListings);
router.get("/listings/:id", getUserListings);

// router.get('/profile/:id', verifyToken, getUser);
router.get('/profile/:id', getUser);

router.get('/get-user/:id', getUserByEmail);

export default router;
// module.exports = router;