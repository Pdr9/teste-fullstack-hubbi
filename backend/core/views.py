from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


class BaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet base com autenticação obrigatória.
    """
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        """
        Automaticamente define o usuário logado como criador.
        """
        serializer.save(user=self.request.user)

