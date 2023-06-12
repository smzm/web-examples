from rest_framework import serializers
from dashboard.models import TradePosition, Review
from users.models import Profile
from rest_framework import serializers

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = get_user_model()
#         fields = ['id', 'username', 'email', 'first_name', 'is_active']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta : 
        model = Profile
        fields = ['id', 'username', 'email']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['body', 'emotion']




class TradeSerializer(serializers.ModelSerializer):
    # owner = ProfileSerializer(many=False)
    review = serializers.SerializerMethodField()

    class Meta:
        model = TradePosition
        exclude = ['owner']
    
    def set_the_owner(self, request):
        self.owner = request.user.profile

    def create(self, obj):
        obj["owner"] = self.owner
        return super().create(obj)


    def get_review(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data



  
        

