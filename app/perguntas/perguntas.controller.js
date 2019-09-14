(function () {
    'use strict';

    angular
        .module('app')
        .controller('Perguntas.Controller', Controller);

    function Controller(PerguntaService) {
        var vm = this;

        vm.Pergunta = null;
        vm.savePergunta = savePergunta;
        vm.deletePergunta = deletePergunta;

        initController();

        function initController() {
            // get current user
            PerguntaService.GetCurrent().then(function (pergunta) {
                vm.Pergunta = pergunta;
            });
        }
        function savePergunta() {
            PerguntaService.Create(vm.Pergunta)
                .then(function () {
                    FlashService.Success('Pergunta atualizada!');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deletePergunta() {
            PerguntaService.Delete(vm.Pergunta._id)
                .then(function () {
                    // log user out
                    $window.location = 'home';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();