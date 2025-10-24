from rest_framework import viewsets


class BaseViewSet(viewsets.ModelViewSet):
    
    def perform_create(self, serializer):
        """
        Automaticamente define o usuário logado como criador.
        """
        serializer.save(user=self.request.user)

