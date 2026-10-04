import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { addNote, aggregationAllNotes, deleteAllNotes, deleteNote, getAll, getNote, getNoteContent, retrievesAllNotes, updateAllNotes, updateNote } from "./note.service.js";

const router = Router();

router.post('/', async (req, res, next) => {
    const data = await addNote(req.query, req.body)
    return successResponse({ res, status: 201, data, message: "Note Created" })

})


router.patch('/:noteId', async (req, res, next) => {
    const data = await updateNote(req.params, req.query, req.body)
    return successResponse({ res, status: 201, data, message: "Note Updated" })

})

router.patch('/notes/all', async (req, res, next) => {
    const data = await updateAllNotes(req.query, req.body)
    return successResponse({ res, status: 201, data, message: " All Notes Updated" })

})

router.delete('/:noteId', async (req, res, next) => {
    const data = await deleteNote(req.params, req.query)
    return successResponse({ res, status: 201, data, message: "Note deleted" })

})

router.get('/', async (req, res, next) => {
    const data = await getAll(req.query)
    return successResponse({ res, status: 200, data, message: "fetch all notes" })

})

router.get('/note-by-content', async (req, res, next) => {
    const data = await getNoteContent(req.query)
    return successResponse({ res, status: 200, data, message: "fetch note content" })

})

router.get('/notes-with-user', async (req, res, next) => {
    const data = await retrievesAllNotes(req.query);
    return successResponse({ res, status: 200, data, message: 'Fetch all notes with user information', })
})

router.get('/aggregate', async (req, res, next) => {
    const data = await aggregationAllNotes(req.query);
    return successResponse({ res, status: 200, data, message: 'Fetch notes using aggregation' })

});

router.get('/:noteId', async (req, res, next) => {
    const data = await getNote(req.params, req.query)
    return successResponse({ res, status: 200, data, message: "fetch note" })

})

router.delete('/', async (req, res, next) => {
  const data = await deleteAllNotes(req.query);
   return successResponse({ res, status: 200, data, message: "All notes deleted successfully" })

});







export default router;



