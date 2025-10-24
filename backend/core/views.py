from rest_framework import viewsets


class BaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet base com configurações compartilhadas.
    """
    
    def perform_create(self, serializer):
        """
        Automaticamente define o usuário logado como criador.
        """
        serializer.save(user=self.request.user)

