from rest_framework.decorators import action
from rest_framework.response import Response
from core.views import BaseViewSet
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(BaseViewSet):
    """
    ViewSet para gerenciar produtos.
    """
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        """Retorna produtos do usuário logado"""
        return Product.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """
        Retorna produtos criados pelo usuário logado.
        
        Endpoint: /api/products/my_products/
        """
        products = Product.objects.filter(user=request.user)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
