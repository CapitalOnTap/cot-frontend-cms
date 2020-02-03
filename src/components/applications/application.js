import './inspectlet';
import './serializeObject';
import './script';

class Application {
  constructor() {
    this.applicationForm = document.getElementById('applicationForm');
  }

  startApp() {
    
    $(function () {
      if (!Modernizr.inputtypes.date) {
          $("#DateOfBirth").prop('type', 'text');
      }
    });

    window.addEventListener('load', () => {
        function tagInspectletSession(tagName, tagValue) {
            if (typeof window !== 'undefined' && window.__insp !== undefined) {
                console.log('Tagged Inspectlet session: { Tag: ' + tagName + ', Value: ' + tagValue + ' } }');
                var obj = {};
                obj[tagName] = tagValue;
                window.__insp.push(['tagSession', obj]);
            }
        }
        function getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
            $(".wrapper").css('opacity', '1');
            // Move to document upload screen if uploadDocuments is in URL on initial load
            if (location.search.substring(1).indexOf('uploadDocuments') > -1 && location.search.substring(1).indexOf('emailAddress') > -1) {
                $('.em .step1_content').css('display', 'none');
                $('.em .step2_content').css('display', 'block');
                $("#progress-bar-current").removeClass().addClass("step2");
                $("html, body").animate({ scrollTop: 0 }, 1000);
                let emailAddress = getUrlVars()['emailAddress'];
                $('#customersEmailAddress')[0].value = emailAddress;
                let locatorId = getUrlVars()['locatorId'];
                $('#customersLocatorId')[0].value = locatorId;
                removeFromQueryString("emailAddress", emailAddress);
                removeFromQueryString("locatorId", locatorId);
            }
            tagInspectletSession('Region', 'ES')
        // $(function () {
        //     // Call on every window resize
        //     $(window).resize(function () {
        //       if (Modernizr.mq('(max-width: 1024px)')) {
        //             $(".em .footer_section .footer_left").insertAfter('.em .footer_section .footer_right');
        //         } else {
        //             // Clear the settings etc
        //             $(".em .footer_section .footer_left").insertBefore('.em .footer_section .footer_right');   // <<< whatever the other margin value should be goes here
        //         }
        //     }).resize();   // Cause an initial widow.resize to occur
        // });
        //Form Validator
        //*************Check if radio is checked or not
        if ($("#applicationForm").length) {
            $("#applicationForm input[type=radio]").on("change", function () {
                $("#applicationForm").validate().element($(this)[0]);
            });
        }
        //**************Check if chekckbox is selected or not
        if ($("#applicationForm").length) {
            $("#applicationForm input[type=checkbox]").on("change", function () {
                $("#applicationForm").validate().element($(this)[0]);
            });
        }
        //*** CUSTOMER NIE/DIE Validation
        jQuery.validator.addMethod("niedievalidation", function (value, element) {
            var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
            var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
            var nieRexp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
            var str = value.toString().toUpperCase();
            if (!nifRexp.test(str) && !nieRexp.test(str)) return false;
            var nie = str
                .replace(/^[X]/, '0')
                .replace(/^[Y]/, '1')
                .replace(/^[Z]/, '2');
            var letter = str.substr(-1);
            var charIndex = parseInt(nie.substr(0, 8)) % 23;
            if (validChars.charAt(charIndex) === letter) return true;
            return false;
        }, "Formato incorrecto.");
        //*** CUSTOMER DOB Validation (18-100 years old)
        jQuery.validator.addMethod("dobValidation", function (value, element) {
            if (!Modernizr.inputtypes.date) {
                //browser does not support input type date
                var now = new moment();
                var minDate = new moment();
                var maxDate = new moment();
                minDate.year(now.year() - 100);
                maxDate.year(now.year() - 18);
                if (moment(value, 'DD/MM/YYYY', true).isValid()) {
                    return maxDate.isAfter(moment(value, 'DD/MM/YYYY', true))
                        && moment(value, 'DD/MM/YYYY', true).isAfter(minDate);
                }
                return false;
            }
            var now = new moment();
            var minDate = new moment();
            var maxDate = new moment();
            minDate.year(now.year() - 100);
            maxDate.year(now.year() - 18);
            if (moment(value).isValid()) {
                return maxDate.isAfter(moment(value))
                    && moment(value).isAfter(minDate);
            }
        }, 'Debes ser mayor de edad para rellenar esta solicitud.');
        //*** Emails match validation
        jQuery.validator.addMethod("emailMatch", function (value, element) {
            var email = $("#EmailAddress").val();
            return (value === email);
        }, 'Los correos electrónicos no coinciden');
        //******** Add your form id here********
        var applicationForm = "#applicationForm";
        $(applicationForm).validate({
            //Ignore Field is for the Ignoring display None inputs validation
            ignore: [],
            rules: {
                BusinessType: {
                    required: function (element) {
                        if (document.getElementById('BusinessType').value == "SoleTrader") {
                            $("#RegistrationNumber")[0].value = '';
                        }
                        return true;
                    }
                },
                BusinessLegalName: {
                    required: function (element) {
                        return document.getElementById('BusinessType').value == "LimitedCompany"
                    }
                },
                TradingName: {
                    required: true,
                },
                RegistrationNumber: {
                    required: function (element) {
                        return document.getElementById('BusinessType').value == "LimitedCompany"
                    },
                    pattern: function (element) {
                        if (document.getElementById('BusinessType').value == "SoleTrader") {
                            return /.*$/;
                        }
                        else {
                            return /[a-zA-Z]{1}\d{8}$/;
                        }
                    },
                },
                RoleInBusiness: {
                    required: function (element) {
                        return document.getElementById('BusinessType').value == "LimitedCompany"
                    }
                },
                RoleInBusiness_Other: {
                    required: function (element) {
                        if (document.getElementById('BusinessType').value == "LimitedCompany" &&
                            $("#RoleInBusiness")[0].value == "Otros (especificar)") {
                            return true;
                        }
                        return false;
                    }
                },
                YearsTrading: {
                    required: true,
                },
                BusinessLandline: {
                    required: true,
                    pattern: /[5-9]{1}\d{8}$/,
                    maxlength: 9
                },
                MonthlyTurnover: {
                    required: true,
                },
                BusinessAddress__Street: {
                    required: true,
                },
                BusinessAddress__BuildingNumber: {
                    required: true,
                },
                BusinessAddress__PostCode: {
                    required: true,
                    pattern: /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/
                },
                Title: {
                    required: true,
                },
                FirstName: {
                    required: true,
                },
                LastName: {
                    required: true,
                },
                DateOfBirth: {
                    required: true,
                    pattern: function (element) {
                        if (!Modernizr.inputtypes.date) {
                            return /(0[1-9]|[12]\d|3[01])\/((0[1-9]|1[0-2])\/[12]\d{3})/
                        }
                        return
                    },
                    dobValidation: true
                },
                "PersonalIdentifications[0]__DocumentNumber": {
                    required: true,
                    niedievalidation: true
                },
                HomePhone: {
                    required: true,
                    pattern: /[5-9]{1}\d{8}$/,
                    maxlength: 9
                },
                MobilePhone: {
                    required: true,
                    pattern: /[6-7]{1}\d{8}$/,
                    maxlength: 9
                },
                "AdditionalQuestions[0]__Answer": {
                    required: true,
                },
                PersonalAddress__Street: {
                    required: true,
                },
                PersonalAddress__Locality: {
                    required: true,
                },
                PersonalAddress__BuildingNumber: {
                    required: true,
                },
                PersonalAddress__PostCode: {
                    required: true,
                    pattern: /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/
                },
                BusinessAddress__Locality: {
                    required: true,
                },
                BusinessAddress__City: {
                    required: true,
                },
                PersonalAddress__City: {
                    required: true,
                },
                EmailAddress: {
                    required: true,
                },
                ConfirmEmailAddress: {
                    required: true,
                    emailMatch: true
                },
                Password: {
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W\_]{8,}$/
                },
                Agreed: {
                    required: true,
                }
            },
            onfocusout: function (element) {
                $(element).valid();
                // Show submit button as yellow if no errors and all required fields entered
                var errors = $("#applicationForm").validate().errorMap;
                if (Object.keys(errors).length !== 0) {
                    $("#submitApplication").removeClass('complete');
                    return
                }
                var valRules = $("#applicationForm").validate().settings.rules;
                for (let [key, value] of Object.entries(valRules)) {
                    if (value.required === true && $("#" + key).val() === "") {
                        $("#submitApplication").removeClass('complete');
                        return
                    }
                }
                $("#submitApplication").addClass('complete');
            },
            errorClass: 'error',
            validClass: 'valid',
            errorElement: 'span',
            highlight: function (element, errorClass, validClass) {
                $(element).addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).removeClass(errorClass).addClass(validClass);
            },
            /*comment this code if you dont want messages*/
            messages: {
                RegistrationNumber: { pattern: "Formato incorrecto. No incluya espacios ni caracteres especiales (Ej. A12345678)" },
                BusinessLandline: { pattern: "Formato incorrecto. Se requieren 9 dígitos. No incluya espacios ni caracteres especiales.", maxlength: "Formato incorrecto. Se requieren 9 dígitos. No incluya espacios ni caracteres especiales." },
                BusinessAddress__PostCode: { pattern: "Formato incorrecto. Este campo debe ser numérico (5 dígitos)" },
                HomePhone: { pattern: "Formato incorrecto. Se requieren 9 dígitos. No incluya espacios ni caracteres especiales.", maxlength: "Formato incorrecto. Se requieren 9 dígitos. No incluya espacios ni caracteres especiales." },
                MobilePhone: { pattern: "Formato incorrecto. Se requieren 9 dígitos. No incluya espacios ni caracteres especiales.", maxlength: "Formato incorrecto. Se requieren 9 dígitos. No incluya espacios ni caracteres especiales." },
                PersonalAddress__PostCode: { pattern: "Formato incorrecto. Este campo debe ser numérico (5 dígitos)" },
                Agreed: { required: "Por favor acepta la política de privacidad" },
                DateOfBirth: { pattern: "Formato no válido. Utilice el siguiente formato dd/mm/aaaa y asegúrese de incluir la barra diagonal." },
                Password: { pattern: "Tu contraseña debe tener una longitud mínima de 8 caracteres, y debe contener al menos una letra mayúscula, una letra minúscula y un número." },
            },
            //***********comment this code if you dont want messages*/
            //Add your class instead of .form-msg (after that class error message will show)
            errorPlacement: function (error, element) {
                if ($(element).is("input")) {
                    error.insertAfter($(element).closest(".form-msg"));
                }
                else if ($(element).is("select")) {
                    error.insertAfter($(element).closest(".form-msg"));
                }
                else {
                    error.insertAfter(element)
                }
            }
        });
        jQuery.extend(jQuery.validator.messages, {
            required: "Este campo es obligatorio.",
            email: "Por favor ingresa un correo electrónico válido"
        });
        $(function () {
            //**********On Submit form will be submit
            $("#applicationForm button[type='submit']").click(function (e) {
                e.preventDefault();
            });
        });
        //**********On Submit form will be submit
        $(function () {
            $("#submitApplication").click(function () {
              
                // let isFormValid = $('#applicationForm').valid();
                let isFormValid = true;
                if (!isFormValid) {
                    setTimeout(function () {
                        $(".error").first().focus();
                    }, 50)
                    return;
                }
                else {
                    // Hide current screen
                    $('.em .step1_content').css('display', 'none');
                    // Show loading screen
                    $('#loadingDiv').show();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Insert tracking pixel for Offer Conversion
                    var str = '<img src="https://fd.paisajellanero.com/aff_l?offer_id=8451" width="1" height="1" />';
                    document.body.insertAdjacentHTML('beforeend', str);
                    // Set email address field on upload document form and tag inspectlet
                    $('#customersEmailAddress')[0].value = $('#EmailAddress').val();
                    tagInspectletSession('CustomerName', $("#customersEmailAddress").val());
                    
                    // Update querystring and move to next page
                    // addToQueryString("uploadDocuments", "true");
                    // POST to Formkeep (fallback in case API fails)
                    $("#UniqueId").val(generateRand(2, 2, 2, 10))
                    let formKeepUrl = (window.location.hostname === "www.capitalontap.com" || window.location.hostname === "capitalontap.com")
                        ? "https://formkeep.com/f/42b3f2447e2f"   // Production
                        : "https://formkeep.com/f/dfc3f7e35fe6";  // Non-production
                    $.ajax({
                        type: 'POST',
                        url: formKeepUrl,
                        data: $('#applicationForm').serialize()
                    });
                    
                    // Get API prefix based on website
                    const apiPrefix = getEnvironment();
                    // POST to Credentials endpoint
                    // var credentialsUri = 'https://' + apiPrefix + 'api-public.capitalontap.es/api/v1/Credentials';
                    var credentialsUri = 'https://' + apiPrefix + 'api-public.capitalontap.com/api/v1/Credentials';
                    var credentialsFormData = JSON.stringify({
                        username: $("#EmailAddress").val(),
                        password: $("#Password").val()
                    });
                    $.ajax({
                        type: "POST",
                        url: credentialsUri,
                        data: credentialsFormData,
                        success: function (data) {
                            // Created credentials successfully, POST to Applications endpoint
                            var applicationsUri = 'https://' + apiPrefix + 'api-public.capitalontap.com/api/v1/Applications';
                            // var applicationsUri = 'https://' + apiPrefix + 'api-public.capitalontap.es/api/v1/Applications';
                            var applicationFormData = JSON.stringify($("#applicationForm").serializeObject());
                            $.ajax({
                                type: "POST",
                                url: applicationsUri,
                                data: applicationFormData,
                                success: function (data) {
                                    // Call heap identify with locatorId if available/success, otherwise fallback to email
                                    var identifier = $("#customersLocatorId").val() || $("#customersEmailAddress").val();
                                    if (window.heap) {
                                        window.heap.identify(identifier);
                                    }
                                    // If POST to API was successful, set locator ID and tag inspectlet
                                    var locatorId = data.result;
                                    $('#customersLocatorId')[0].value = locatorId;
                                    tagInspectletSession('LocatorId', locatorId);
                                    window.dataLayer = window.dataLayer || [];
                                    window.dataLayer.push({
                                        'event': 'Step2',
                                        'UserId': locatorId
                                    });
                                    // Set cookie containing locator ID
                                    var environmentPrefix = getEnvironment();
                                    var expiry = new Date();
                                    expiry.setMonth(expiry.getMonth() + 6);
                                    document.cookie = "ES-App-UserId=" + locatorId + ";expires=" + expiry +
                                        ";domain=" + environmentPrefix + "www.capitalontap.com;";
                                    // Created credentials successfully, POST to auth endpoint
                                    var environmentSuffix = getEnvironment(true);
                                    var authUri = 'https://' + environmentPrefix + 'api-auth.capitalontap.es/connect/token?redirectToJourney=true';
                                    var schemeAndPrefix = 'https://' + environmentPrefix
                                    if (environmentPrefix === 'local-') {
                                        schemeAndPrefix = 'http://local-'
                                    }
                                    var authFormData = {
                                        client_id: "account-web" + environmentSuffix,
                                        grant_type: "password",
                                        username: $("#EmailAddress").val(),
                                        password: $("#Password").val()
                                    };
                                    formPost(authUri, 'post', authFormData);
                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                    // Call heap identify with locatorId if available/success, otherwise fallback to email
                                    var identifier = $("#customersLocatorId").val() || $("#customersEmailAddress").val();
                                    if (window.heap) {
                                        window.heap.identify(identifier);
                                    }
                                    // Hide loading screen, show error
                                    $('#loadingDiv').hide();
                                    $('#errorDiv').show();
                                },
                                dataType: "json",
                                contentType: "application/json"
                            });
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            // Call heap identify with email
                            if (window.heap) {
                                window.heap.identify($("#customersEmailAddress").val());
                            }
                            // Hide loading screen, show duplicate creds for 409 otherwise error
                            $('#loadingDiv').hide();
                            if (xhr.status === 409) {
                                $('#duplicateUserDiv').show();
                            } else {
                                $('#errorDiv').show();
                            }
                        },
                        dataType: "json",
                        contentType: "application/json"
                    });
                    
                    if (ga) {
                        ga('send', 'event', 'ES Application', 'Application Submitted', 'ES New Application Submitted');
                    }

                    let leadType = document.getElementById('BusinessType').value == "LimitedCompany" ? "Empresa" : "Autonomo";
                    if (leadType) {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            'event': 'Step1',
                            'LeadType': leadType
                        });
                    }
                }
            });
            function formPost(action, method, input) {
                'use strict';
                var form;
                form = $('<form />', {
                    action: action,
                    method: method,
                    style: 'display: none;'
                });
                if (typeof input !== 'undefined' && input !== null) {
                    $.each(input, function (name, value) {
                        $('<input />', {
                            type: 'hidden',
                            name: name,
                            value: value
                        }).appendTo(form);
                    });
                }
                form.appendTo('body').submit();
            }
            $('#documents').change(function (event) {
                if ($("#documents")[0].files.length > 0) {
                    $('#documentFormSubmit').show();
                    $('#filesUploaded').show();
                    var files = $("#documents")[0].files;
                    var fileNames = [];
                    for (var i = 0; i < files.length; i++) {
                        fileNames.push(files[i].name);
                    }
                    $('#fileNames').text(fileNames.join(', '));
                }
                else {
                    $('#filesUploaded').hide();
                    $('#documentFormSubmit').hide();
                }
            });
            $("#documentFormSubmit").click(function () {
                var fdata = new FormData();
                fdata.append("emailAddress", $("#customersEmailAddress").val());
                fdata.append("locatorId", $("#customersLocatorId").val());
                if ($("#documents")[0].files.length > 0) {
                    var files = $("#documents")[0].files;
                    for (var i = 0; i < files.length; i++) {
                        fdata.append("document" + (i + 1), files[i]);
                    }
                }
                $.ajax({
                    type: 'POST',
                    url: 'https://formkeep.com/f/51cac822b1dc',
                    data: fdata,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        // Documents uploaded, set query string to uploadDocuments=completed
                        removeFromQueryString("uploadDocuments", "true");
                        addToQueryString("uploadDocuments", "completed");
                    },
                });
                if (ga) {
                    ga('send', 'event', 'ES Application', 'DocumentUploaded', 'ES New Application Form');
                }
            });
            // Move to upload documents after app form submit
            $(".em #submitApplication").click(function () {
                //NOTE: Skipping the move to upload documents, will go straight to journey
                return;
                let isFormValid = $('#applicationForm').valid();
                if (!isFormValid) {
                    return;
                }
                $('.em .step1_content').css('display', 'none');
                $('.em .step2_content').css('display', 'block');
                $("#progress-bar-current").removeClass().addClass("step2");
                $("html, body").animate({ scrollTop: 0 }, 1000);
                return false;
            });
            // Tink screen
            $('#goto_opening_bank').click(function () {
                $('.em .credit_box_parent').css('display', 'none');
                $('#opening_bank,.em .step2_inner').css('display', 'block');
                $("#progress-bar-current").removeClass().addClass("step3");
                loadTink();
                $("html, body").animate({ scrollTop: 0 }, 1000);
            });
            // Bank upload screen
            $('.uploadBankStatements').click(function () {
                $('.em .credit_box_parent').css('display', 'none');
                $('#opening_bank,.em .step2_inner').css('display', 'none');
                $('#bank_statement,.em .step2_inner').css('display', 'block');
                $("#progress-bar-current").removeClass().addClass("step3");
                $("html, body").animate({ scrollTop: 0 }, 1000);
            });
            // After upload screen
            $("#bank_statement button[type='submit']").click(function () {
                $('.em .step2_content').css('display', 'none');
                $('.em .step3_content').css('display', 'block');
                $("#progress-bar-current").removeClass().addClass("step4");
                return false;
            });
            // Back from Tink/Bank Upload to selection screen
            $('.showChoices button').click(function () {
                $('.em .credit_box_parent').css('display', 'block');
                $('#opening_bank,.em .step2_inner').css('display', 'none');
                $('#bank_statement,.em .step2_inner').css('display', 'none');
                $("#progress-bar-current").removeClass().addClass("step2");
                $("html, body").animate({ scrollTop: 0 }, 1000);
            });
            $('#LimitedCompany').click(function () {
                document.getElementById('BusinessType').value = 'LimitedCompany';
                $('#LimitedCompany').addClass('selected');
                $('#SoleTrader').removeClass('selected');
                $('#RoleInBusinessWrapper').slideDown();
                $('#RegistrationNumberWrapper').slideDown();
                $('#BusinessLegalNameWrapper').slideDown();
            });
            $('#SoleTrader').click(function () {
                document.getElementById('BusinessType').value = 'SoleTrader';
                $('#SoleTrader').addClass('selected');
                $('#LimitedCompany').removeClass('selected');
                $('#RoleInBusinessWrapper').slideUp();
                $('#RegistrationNumberWrapper').slideUp();
                $('#BusinessLegalNameWrapper').slideUp();
            });
        });
        var provinces = ["Álava"
            , "Albacete"
            , "Alicante"
            , "Almería"
            , "Ávila"
            , "Badajoz"
            , "Islas Baleares"
            , "Barcelona"
            , "Burgos"
            , "Cáceres"
            , "Cádiz"
            , "Castellón"
            , "Ciudad Real"
            , "Córdoba"
            , "A Coruña"
            , "Cuenca"
            , "Gerona"
            , "Granada"
            , "Guadalajara"
            , "Gipuzkoa"
            , "Huelva"
            , "Huesca"
            , "Jaén"
            , "León"
            , "Lérida"
            , "La Rioja"
            , "Lugo"
            , "Madrid"
            , "Málaga"
            , "Murcia"
            , "Navarra"
            , "Ourense"
            , "Asturias"
            , "Palencia"
            , "Las Palmas"
            , "Pontevedra"
            , "Salamanca"
            , "Santa Cruz de Tenerife"
            , "Cantabria"
            , "Segovia"
            , "Sevilla"
            , "Soria"
            , "Tarragona"
            , "Teruel"
            , "Toledo"
            , "Valencia"
            , "Valladolid"
            , "Bizkaia"
            , "Zamora"
            , "Zaragoza"
            , "Ceuta"
            , "Melilla"
        ];
        $(function () {
            $('#BusinessAddress__PostCode').change(function (formElement) {
                if ($('#BusinessAddress__PostCode').valid()) {
                    var number = Math.floor(this.value / 1000);
                    let BusinessAddress__City = $('#BusinessAddress__City');
                    BusinessAddress__City[0].value = provinces[number - 1];
                    BusinessAddress__City[0].text = provinces[number - 1];
                }
            });
            $('#PersonalAddress__PostCode').change(function (formElement) {
                if ($('#PersonalAddress__PostCode').valid()) {
                    var number = Math.floor(this.value / 1000);
                    let PersonalAddress__City = $('#PersonalAddress__City');
                    PersonalAddress__City[0].value = provinces[number - 1];
                    PersonalAddress__City[0].text = provinces[number - 1];
                }
            });
            $("#RoleInBusiness").change(function () {
                if ($("#RoleInBusiness")[0].value == "Otros (especificar)") {
                    $('#RoleInBusiness_OtherWrapper').slideDown();
                }
                else {
                    $('#RoleInBusiness_OtherWrapper').slideUp();
                }
            });
        });
    });

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    function loadTink() {
        // Set Tink iframe URL
        var redirectUri = window.location.origin + window.location.pathname;
        var market = getUrlParameter("market") || "ES";
        var locale = getUrlParameter("locale") || "es_ES";
        var test = getUrlParameter("test") === "" ? "" : "&test=true";
        var tinkIframeUrl = 'https://oauth.tink.com/1.0/authorize/?client_id=136c8f83805147ac901d3b61cbd29726&redirect_uri=' + redirectUri + '&scope=accounts:read,transactions:read,investments:read,user:read,credentials:read,statistics:read&grant_type=authorization_code&market=' + market + '&locale=' + locale + '&iframe=true' + test;
        var verificationIframe = document.getElementById("verification-iframe");
        verificationIframe.src = tinkIframeUrl;
    }
    function getEnvironment(suffix = false) {
        let environment;
        if (!window.location.hostname.endsWith("www.capitalontap.com")) {
            environment = "local-";
        } else {
            environment = window.location.hostname.replace("www.capitalontap.com", "");
        }
        if (suffix === true && environment.indexOf("-") != -1) {
            environment = "-" + environment.replace("-", "");
        }
        return environment;
    }
    // Postback from Tink
    function receiveMessage(event) {
        if (event.origin !== "https://oauth.tink.com") {
            return;
        }
        if (event.data) {
            var json = JSON.parse(event.data);
            if (json.type == "code") {
                // Get public API prefix based on website
                var apiPrefix = getEnvironment();
                var uri = 'https://' + apiPrefix + 'api-public.capitalontap.es/api/v1/ThirdPartyData';
                var email = $("#customersEmailAddress").val()
                var code = json.data;
                var data = {
                    "serviceName": "Tink",
                    "emailAddress": email,
                    "authorizationCode": code
                };
                var locatorId = $("#customersLocatorId").val()
                if (locatorId !== undefined && locatorId !== null && locatorId !== '') {
                    data.locatorId = locatorId;
                }
                var jsonData = JSON.stringify(data);
                // Write response to console
                console.log('Callback from Tink successful, POSTing to ' + uri);
                console.log(jsonData);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", uri, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        console.log('POST to ' + uri + ' successful, response as follows:');
                        console.log(xhr.responseText);
                    }
                };
                xhr.send(jsonData);
                // Tink completed, set query string to uploadDocuments=completed
                removeFromQueryString("uploadDocuments", "true");
                addToQueryString("uploadDocuments", "completed");
                $('.em .step2_content').css('display', 'none');
                $('.em .step3_content').css('display', 'block');
                $("#progress-bar-current").removeClass().addClass("step4");
                if (ga) {
                    ga('send', 'event', 'ES Application', 'TinkCompleted', 'ES New Application Form');
                }
            }
            else
                if (json.error.status == "USER_CANCELLED") {
                    $('.em .credit_box_parent').css('display', 'block');
                    $('#opening_bank,.em .step2_inner').css('display', 'none');
                    $('#bank_statement,.em .step2_inner').css('display', 'none');
                    $("#progress-bar-current").removeClass().addClass("step2");
                    $("html, body").animate({ scrollTop: 0 }, 1000);
                }
        }
    }
    window.addEventListener("message", receiveMessage, false);
    function addToQueryString(name, value) {
        var queryString = location.search.substring(1);
        if (queryString && queryString.length) {
            queryString += '&' + name + '=' + value;
        }
        else {
            queryString = name + '=' + value;
        }
        window.history.replaceState({}, '', window.location.origin + window.location.pathname + '?' + queryString);
        //location.search = $.param(queryParameters);
    }
    function removeFromQueryString(name, value) {
        var queryString = location.search.substring(1);
        var newQueryString = [];
        if (queryString && queryString.length) {
            queryString.split('&').forEach(function (item) {
                if (item !== '' + name + '=' + value) {
                    newQueryString.push(item);
                }
            });
        }
        window.history.replaceState({}, '', window.location.origin + window.location.pathname + '?' + newQueryString.join('&'));
    }
    function generateRand(upper, lower, numbers, any) {
        var chars = [
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "abcdefghijklmnopqrstuvwxyz",
            "0123456789",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        ];
        return [upper, lower, numbers, any].map(function (len, i) {
            return Array(len).fill(chars[i]).map(function (x) {
                return x[Math.floor(Math.random() * x.length)];
            }).join('');
        }).concat().join('').split('').sort(function () {
            return 0.5 - Math.random();
        }).join('')
    }

    let gaData = '';
    if (cookie.get('gacid')) {
        gaData += 'GACid: ' + cookie.get('gacid');
    }
    if (cookie.get('keyword')) {
        gaData += 'Keywords: ' + cookie.get('keyword');
    }
    if (cookie.get('_utmz')) {
        gaData += 'Campaign: ' + cookie.get('_utmz');
    }
    document.getElementById('gaData').value = gaData;
  }

  init() {
    if (this.applicationForm) {
      this.startApp()
    }
  }

}
export default Application;
