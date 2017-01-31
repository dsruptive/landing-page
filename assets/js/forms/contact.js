var ContactForm = function () {

    return {

        //Contact Form
        initContactForm: function () {
	        // Validation
	        $("#sky-form3").validate({
	            // Rules for form validation
	            rules:
	            {
	                name:
	                {
	                    required: true
	                },
	                email:
	                {
	                    required: true,
	                    email: true
	                }
	            },

	            // Messages for form validation
	            messages:
	            {
	                name:
	                {
	                    required: 'Please enter your name',
	                },
	                email:
	                {
	                    required: 'Please enter your email address',
	                    email: 'Please enter a VALID email address'
	                }
	            },

	            // Ajax form submition
	            submitHandler: function(form)
	            {
	                $(form).ajaxSubmit(
	                {
	                    beforeSend: function(formData, jqForm, options)
	                    {
	                        $('#sky-form3 button[type="submit"]').attr('disabled', true);
	                    },
	                    success: function(responseText, statusText, xhr, $form)
	                    {
                        var uid = $('#sky-form3 input[name="uid"]').val();
                        var countryCode = $('#sky-form3 select[name="country"]').find(":selected").val();
                        var country = $('#sky-form3 select[name="country"]').find(":selected").text();
                        var name = $('#sky-form3 input[name="name"]').val();
                        var email = $('#sky-form3 input[name="email"]').val();
                        var regDate = new Date().toJSON();

                        var key = firebase.database().ref().child('users/'+uid).push().key;

                        firebase.database().ref('userdata/'+uid).set({
                          "country": country,
                          "countryCode": countryCode,
                          "email": email,
                          "name": name,
                          "registration-time": regDate
                        });
                        var setVisit = {};
                        setVisit['users/'+uid+'/visits/'+key] = regDate;
                        firebase.database().ref().update(setVisit);

                				$('.sky-form').remove();
                				$('.registration-complete').removeClass('hidden');

                        $("#sky-form3").addClass('submited');
	                    }
	                });
	            },

	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            }
	        });
        }

    };

}();
