from users.models import Profile
from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from users.models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ['first_name', 'email', 'username', 'password1', 'password2']
        labels = {'first_name': 'Name'}

    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)

        for name, field in self.fields.items():
            field.widget.attrs.update({'class': 'border border-gray-300'})

class ProfileForm(ModelForm):
    class Meta:
        model = Profile
        fields = "__all__"
        exclude = ["user"]


