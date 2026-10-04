import { Router } from "express";
import { deleteUser, getUser, updateUser } from "./user.service.js";
import { successResponse } from "../../common/utils/success.response.js";

const router = Router();

// Update User
router.patch('/:id', async (req, res, next) => {
  const data = await updateUser(req.params, req.body)
  return successResponse({ res, status: 200, data, message: "user updated" })

})


// Delete User
router.delete('/', async (req, res, next) => {
  const data = await deleteUser(req.query, req.body)
  return successResponse({ res, status: 200, data, message: "user Deleted" })

})

// Delete User
router.get('/', async (req, res, next) => {
  const data = await getUser(req.query, req.body)
  return successResponse({ res, status: 200, data, message: "fetch user" })

})

export default router;



