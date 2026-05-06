`kernel`: backend projemiz olacak. tcp port olarak 6680 kullanacak. nodejs expressjs  restful, mongodb, mongoose teknolijilerini kullanacak.  mongodb veri tabani ismi: `defter` olacak.

`admin`:  admin panel projemiz olacak.  program kullacilari = members  hareketlerini kullanim istatistiklerini vs gorebilecegimiz bir yonetim paneli olacak. adminUsers, adminSessions tablolarimiz olacak. her loginde admin kullanicilari deviceId (guid bir sayi localStorage yoksa eklenecek) ile oturum acacaklar. kernel yeniden basladiginda adminUsers bos ise  kullaniciadi: `admin` , parola: `Admin!234`  kullanici olusturacak. dark/light mode destekleyek. teknolojiler: reactjs, tailwind, videjs, shadcn olacak.  tum input ve komponentler shadcn kullanilacak. dev calisma portu: 6681 olacak.

`client` : uyelerin(members) kullancagi google ile authenticate olacak. calisma portu: 6682 olacak. teknolojileri: vite, reactjs, tailwind, shadcn, pwa, videjs dark/light mode destekleyek. tum input ve komponentler shadcn kullanilacak.

`web`: web sitemiz olacak. calisma portu: 6683 olacak. projenin tanitim sitesi olacak. teknoloji: vite, reactjs, tailwind, shadcn, videjs dark/light mode destekleyek. tum input ve komponentler shadcn kullanilacak.

- yuklemeler ve calistirmalar icin `yarn` kullanilacak.

- her proje kendi klasorunde olacak, tum paketler kendi klasorlari altinda yuklenecek.  her projenin kendi package.json, tsconfig.json, vite.config.ts, jest.config.js dosyasi olacak. 

- her projenin calisma portu.
    kernel: 6680
    admin: 6681
    client: 6682
    web: 6683
olacak ve port mesgul ise yeni bir port atanmayacak. 


- tum projelerin build/production versiyonlari ana dizindeki `dist` klasorune aktarilacak. 

    dist/client
    dist/admin
    dist/kernel
    dist/web

kernel: https://defterapi.aksoylubilisim.com.tr
client: https://defter.aksoylubilisim.com.tr (pwa)
admin: https://defteradmin.aksoylubilisim.com.tr
web: https://defterweb.aksoylubilisim.com.tr (proje tanitim)

- github actions icin bir workflow olusturulacak. bu workflow ile main branch'e her push'da `dist` icindeki klasorler sunucudaki ilgili klasorlere kopyalanacak. 

- bu planda yazilanlar kural olarak instructions'a eklenecek. 
