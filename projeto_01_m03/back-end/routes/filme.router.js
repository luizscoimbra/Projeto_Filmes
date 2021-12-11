const express = require('express');


const router = express.Router();


const filmeController = require('../controllers/filme.controller');


router.get('/', filmeController.getFilme)


router.get('/:id', filmeController.getFilmeById)


router.post('/add', filmeController.postFilme)


router.put('/edit/:id', filmeController.putFilme)


router.delete('/delete/:id', filmeController.deleteFilme)



module.exports = router;

