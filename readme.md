# Weather App

<img src="http://maciejf.pl/img/weatherApp/weatherApp4.jpg" width="100%" />

Prosta aplikacja pogodowa dostaraczająca informacje o aktualnych danych metrologicznych.
Z jej poziomu dowiemy się jaka jest pogoda wielu zakątkach świata a także większości miast polskich.
Aplikacja podaje takie informacje jak:

- temperaturę
- temperaturę odczuwalną
- ciśnienie atmosferyczne
- wilgotność
- stopień zachmurzenia
- prędkość wiatru
- widoczność na drodze
- godzina wschodu i zachodu słońca
- aktualny dzień i godzina dla danego miasta
- 12h prognozę
- dla Polskich miast poprzez serwis Airly podawany stopień zanieczyszczenia <br>
  cząsteczkami PM1, PM2,5, PM10

### Demo aplikacji:

[http://maciejf.pl/weather/](http://maciejf.pl/weather/)

## Użyte technologie

<img src="http://maciejf.pl/img/weatherApp/technologie.png"  />

#### Użyte API

<img src="http://maciejf.pl/img/weatherApp/API1.png"  />

## Opis 

Responsywna aplikacja napisana w JavaScript i jQuery.

### _Autolokalizacja_

1. W pierwszej kolejności aplikacja wysyła zapytanie do `ip-api`, określając po numerze ip, rodzaj sieci z której wysłano zapytanie, współrzędne geograficzne, państwo i miasto. Jeśli zapytanie zostało wysłano z internetu mobilnego dalsze kroki są pomijane.

2. Następnie do `Dark Sky API` wysyłane są współrzędne geograficzne. Zwrotnie pobierane są wszystkie dane dotyczące pogody.

3. Jeśli pogoda dotyczy Polski, z `Airly` zostają pobrane informacje o jakości powietrza i stężeniu pyłków PM1, PM2,5 i PM10.

4. Na koniec z `World Time` pobierany jest aktualny dzień tygodnia i lokalna godzina.

### _Ręczne wyszukiwanie_

1. Dla Polski zaimplementowany jest `autocomplete` który podpowiada nam nazwy miast.

2. Nazwa miasta wysyłana jest do `Graphhopper`. Serwis zwraca nazwę kraju i współrzędne geograficzne.

3. Jeśli dane dotyczą Polski, z `Airly` zostają pobrane informacje o jakości powietrza i stężeniu pyłków PM1, PM2,5 i PM10.

4. Na koniec z `World Time` pobierany jest aktualny dzień tygodnia i lokalna godzina.

<br><br>

## Prezentacja

**_Dzień/Noc_**

<img src="http://maciejf.pl/img/weatherApp/gif/black-white.gif"  />
<br>

**_Autolokalizacja_**

<img src="http://maciejf.pl/img/weatherApp/gif/autolocation.gif"  />
<br>

**_Autocomplete_**

<img src="http://maciejf.pl/img/weatherApp/gif/autocomplete.gif"  />

## RWD

<img src="http://maciejf.pl/img/weatherApp/rwd.jpg"  />
