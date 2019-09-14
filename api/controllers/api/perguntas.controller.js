var config = require('config.json');
var express = require('express');
var router = express.Router();
var perguntaService = require('services/pergunta.service');

// routes
router.post('/register', registerPerg);
router.get('/current', getCurrentPerg);
router.put('/:_id', updatePerg);
router.delete('/:_id', deletePerg);

module.exports = router;



function registerPerg(req, res) {
    perguntaService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentPerg(req, res) {
    perguntaService.getById(req.session.pergId)
        .then(function (pergunta) {
            if (pergunta) {
                res.send(pergunta);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updatePerg(req, res) {
    var pergId = req.session.pergId;
    if (req.params._id !== pergId) {
        // can only update own account
        return res.status(401).send('Você não pode atualizar essa pergunta, pois não possui a sua sessão.');
    }

    perguntaService.update(pergId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletePerg(req, res) {
    var pergId = req.session.pergId;
    if (req.params._id !== pergId) {
        // can only delete own account
        return res.status(401).send('Você não pode deletar essa pergunta, pois não possui a sua sessão.');
    }

    perguntaService.delete(pergId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}