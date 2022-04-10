# VALIDKIT

## İşlevi
validkit javascript ile form validasyonları yapan bir kütüphanedir

## Tanımlama
```
const validkit = new ValidateForm({
  root: "#form",
  submitOnValid: false,
  inputEvent: "keyup",
  submitFunc: async (valid) => {
    if(valid.mistake.length === 0) {
      //--- Hiçbir hata yok
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const result = await response.json()

      console.log(result)
    }
  }
})
```

Yukarıdaki tanımlamada ***root*** özelliğine formun id yada class 'ını yazıyoruz, ***submitOnValid*** özelliği formdaki tüm validasyonlar doğru olduğu zaman formun submit olup olmamasını belirler, ***inputEvent*** ise validasyonları girdilerin hangi eventine göre olacağını belirler.

***submitFunc*** özelliğinde ise formdaki validasyonların tamamı geçmişse ve submitOnValid özelliği false ise bu özelliğin içindeki fonksiyon çalışır. Örnekteki submtiFunc fonksiyonundaki ***valid.mistake*** bize formdaki tüm hataların içinde bulunduğu bir dizi verir

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
Yukarıdaki örnekte basit bir input kontrolü yapıyoruz. ***target*** özelliğine kontol edeceğimiz inputun class ya da id 'sini giriyoruz. En üstteki tanımlamada event olarak keyup eventini seçtiğimiz için target özelliğinde seçilen inputun her keyup olayında belirlediğimiz kontrolleri yapacaktır. Eğer yapılan kontrollerde bir hata varsa ***error*** özelliğine o input için geçerli olan hatalar parametre olarak gelecektir. error özelliğine 2 parametre gelir bunlardan ilki hatalar, ikincisi target özelliğinde seçtiğimiz alandır. İlk parametrede gelecek olan hata mesajları özelliğin karşısında belirlediğimiz string değerlerdir

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

