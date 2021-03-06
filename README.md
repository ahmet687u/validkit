# VALIDKIT

## İşlevi
validkit javascript ile form validasyonları yapmanızı sağlayan bir kütüphanedir

## Import
```
npm i validkit
```
diyerek kütüphaneyi yükleyebilir ve ardından
```
import ValidateForm from 'validkit';
```
bu şekilde import edip kullanabilirsiniz

## Tanımlama
```
const valid = new ValidateForm({
  root: "#form",
  submitOnValid: false,
  inputEvent: "change",
  submitFunc: (valid) => {
    if(!valid.hasMistake) {
      console.log(valid.values)
    } else {
      console.log(valid.mistake);
    } 
  }
})
```

Yukarıdaki tanımlamada ***root*** özelliğine formun id yada class 'ını yazıyoruz, ***submitOnValid*** özelliği formdaki tüm validasyonlar doğru olduğu zaman formun submit olup olmamasını belirler, ***inputEvent*** ise validasyonları girdilerin hangi eventine göre olacağını belirler.

***submitFunc*** özelliğinde ise formdaki validasyonların tamamı geçmişse ve submitOnValid özelliği false ise bu özelliğin içindeki fonksiyon çalışır. Örnekteki submtiFunc fonksiyonundaki ***valid.mistake*** bize formdaki tüm hataların içinde bulunduğu bir dizi verir. ***valid.hasMistake*** hata olup olmadığı hakkında boolean bir değer verir. ***valid.values*** ise inputların value değerlerini döndüren bir obje döndürür. ***valid.values*** 'dan dönen objedeki key değerleri inputların namelerine göre belirlenir. Eğer inputun name değeri yoksa validkit tarafından dinamik bir key değeri atanır

## Örnek Girdi Kontrolü
```
validkit.customControl({
  target: ".pass",
  required: "Şifre alanı zorunlu",
  min: {
    value: 2,
    error: "Şifre alanı en az 2 karakter olmalı"
  },
  error: (err, _) => {
    _.nextElementSibling.innerHTML = "";
    err.forEach(item => _.nextElementSibling.innerHTML += `<p>${item.message}</p>`)
  }
})
```
Yukarıdaki örnekte basit bir input kontrolü yapıyoruz. ***target*** özelliğine kontol edeceğimiz inputun class ya da id 'sini giriyoruz. En üstteki tanımlamada event olarak change eventini seçtiğimiz için target özelliğinde seçilen inputun her change olayında belirlediğimiz kontrolleri yapacaktır. Eğer yapılan kontrollerde bir hata varsa ***error*** özelliğine **o input için geçerli olan hatalar** parametre olarak gelecektir. error özelliğine 2 parametre gelir bunlardan ilki hatalar, ikincisi target özelliğinde seçtiğimiz alandır. İlk parametrede gelecek olan hata mesajları özelliğin karşısında belirlediğimiz string değerlerdir

## Yapabileceğiniz Kontroller
required => Seçili olan alanın zorunlu doldurulması gerektiğini belirtir
```
valid.customControl({
  target: "#select",
  required: "Bir seçenek seçin"
})
```

min => Seçili olan alanın en az kaç karakter olması gerektiğin belirtir
```
valid.customControl({
  target: ".email",
  min: {
    value: 2,
    error: "Email alanı en az 2 karakter olmalı"
  }
})
```

max => Seçili olan alanın en fazla kaç karakter olacağını belirler
```
valid.customControl({
  target: ".email",
  max: {
    value: 6,
    error: "Email alanı en fazla 6 karakter olabilir"
  }
})
```

email => Girilen değerin geçerli bir email adresi olup olmadığını kontrol eder
```
valid.customControl({
  target: ".email",
  email: "Geçersiz email adresi. Lütfen doğru girdiğinizden emin olun"
})
```

checked => Seçili olan alanın checked olup olmadığını kontrol eder. İnputun check özelliği içindir
```
valid.customControl({
  target: "#check",
  checked: "Üyelik sözleşmesini onaylamanız gerekmektedir."
})
```

radio => Seçili olan alanın checked olup olmadığını kontrol eder. İnputun radio özelliği içindir
```
valid.customControl({
  target: "#radio",
  radio: "Herhangi bir seçeneği seçmek zorundasınız"
})
```

## bind() methodu
Bu methodla parametre olarak gönderdiğimiz inputların value değerlerini birbirine bağlarız. Yani bu inputların value değerleri aynı olmalıdır

```
valid.bind({
  targets: [".pass", ".pass2"],
  error: "Şifre alanları eşleşmiyor"
})
```
Bind methodunun iki parametresi vardır. Bunlardan ilki targets:
<br />
targets = Kendisine verilen dizideki seçicilere karşılık gelen girdi alanlarını seçer ve value değerlerinin eşit olup olmadığını kontrol eder.

İkinci parametre ise error:
<br />
error = Value değerleri eşit olmadığında verilecek olan hata mesajı

