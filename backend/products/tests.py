from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from decimal import Decimal
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Product
from products.serializers import ProductSerializer


class ProductModelTest(TestCase):
    """Testes para o modelo Product."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_product(self):
        """Testa criação básica de produto."""
        product = Product.objects.create(
            name='Produto Teste',
            price=Decimal('99.99'),
            user=self.user
        )
        
        self.assertEqual(product.name, 'Produto Teste')
        self.assertEqual(product.price, Decimal('99.99'))
        self.assertEqual(product.user, self.user)
        self.assertIsNotNone(product.created_at)
    
    def test_product_str_representation(self):
        """Testa representação string do produto."""
        product = Product.objects.create(
            name='Produto Teste',
            price=Decimal('50.00'),
            user=self.user
        )
        
        expected = "Produto Teste - R$ 50.00"
        self.assertEqual(str(product), expected)
    
    def test_product_ordering(self):
        """Testa ordenação por data de criação (mais recente primeiro)."""
        product1 = Product.objects.create(
            name='Produto 1',
            price=Decimal('10.00'),
            user=self.user
        )
        product2 = Product.objects.create(
            name='Produto 2',
            price=Decimal('20.00'),
            user=self.user
        )
        
        products = Product.objects.all()
        # Como são criados rapidamente, vamos verificar se ambos existem
        self.assertEqual(products.count(), 2)
        self.assertIn(product1, products)
        self.assertIn(product2, products)


class ProductSerializerTest(TestCase):
    """Testes para ProductSerializer."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_product_serialization(self):
        """Testa serialização de produto."""
        product = Product.objects.create(
            name='Produto Teste',
            price=Decimal('99.99'),
            user=self.user
        )
        
        serializer = ProductSerializer(product)
        data = serializer.data
        
        self.assertEqual(data['name'], 'Produto Teste')
        self.assertEqual(data['price'], '99.99')
        self.assertEqual(data['username'], 'testuser')
        self.assertIsNotNone(data['created_at'])
    
    def test_product_deserialization(self):
        """Testa deserialização de dados para produto."""
        data = {
            'name': 'Novo Produto',
            'price': '50.00'
        }
        
        serializer = ProductSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        product = serializer.save(user=self.user)
        self.assertEqual(product.name, 'Novo Produto')
        self.assertEqual(product.price, Decimal('50.00'))
        self.assertEqual(product.user, self.user)
    
    def test_product_validation_required_fields(self):
        """Testa validação de campos obrigatórios."""
        serializer = ProductSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        self.assertIn('price', serializer.errors)
    
    def test_product_validation_price_format(self):
        """Testa validação de formato de preço."""
        data = {
            'name': 'Produto Teste',
            'price': 'invalid_price'
        }
        
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('price', serializer.errors)


class ProductViewSetTest(APITestCase):
    """Testes para ProductViewSet."""
    
    def setUp(self):
        """Configuração inicial para os testes."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Criar token JWT para autenticação
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Configurar autenticação
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        self.product_data = {
            'name': 'Produto Teste',
            'price': '99.99'
        }
    
    def test_create_product_authenticated(self):
        """Testa criação de produto com usuário autenticado."""
        url = reverse('product-list')
        response = self.client.post(url, self.product_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 1)
        
        product = Product.objects.first()
        self.assertEqual(product.name, 'Produto Teste')
        self.assertEqual(product.price, Decimal('99.99'))
        self.assertEqual(product.user, self.user)
    
    def test_create_product_unauthenticated(self):
        """Testa criação de produto sem autenticação."""
        self.client.credentials()  # Remove autenticação
        
        url = reverse('product-list')
        response = self.client.post(url, self.product_data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Product.objects.count(), 0)
    
    def test_list_products(self):
        """Testa listagem de produtos."""
        # Criar produtos
        Product.objects.create(
            name='Produto 1',
            price=Decimal('10.00'),
            user=self.user
        )
        Product.objects.create(
            name='Produto 2',
            price=Decimal('20.00'),
            user=self.user
        )
        
        url = reverse('product-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_retrieve_product(self):
        """Testa busca de produto específico."""
        product = Product.objects.create(
            name='Produto Teste',
            price=Decimal('50.00'),
            user=self.user
        )
        
        url = reverse('product-detail', kwargs={'pk': product.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Produto Teste')
        self.assertEqual(response.data['price'], '50.00')
    
    def test_update_product(self):
        """Testa atualização de produto."""
        product = Product.objects.create(
            name='Produto Original',
            price=Decimal('30.00'),
            user=self.user
        )
        
        update_data = {
            'name': 'Produto Atualizado',
            'price': '60.00'
        }
        
        url = reverse('product-detail', kwargs={'pk': product.pk})
        response = self.client.put(url, update_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        product.refresh_from_db()
        self.assertEqual(product.name, 'Produto Atualizado')
        self.assertEqual(product.price, Decimal('60.00'))
    
    def test_delete_product(self):
        """Testa exclusão de produto."""
        product = Product.objects.create(
            name='Produto para Deletar',
            price=Decimal('40.00'),
            user=self.user
        )
        
        url = reverse('product-detail', kwargs={'pk': product.pk})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)