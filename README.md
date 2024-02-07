# Real-Time-Chat

Bu uygulama, kullanıcıların gerçek zamanlı olarak birbirleriyle iletişim kurmasını sağlayan basit ve etkili bir chat uygulamasıdır. Hem sunucu (server) tarafında yazılmış bir Express uygulaması hem de istemci (client) tarafında React kullanılarak geliştirilmiştir. Ayrıca, sunucu ve istemciler arasındaki iletişimi sağlamak için Socket.IO kullanılmıştır.

## Temel Özellikler:

1. Kullanıcı Girişi ve Odaya Katılım :
- Kullanıcılar, giriş ekranında kendilerine bir kullanıcı adı ve oda adı belirleyerek uygulamaya katılır.
- Her oda, kullanıcılar arasında ayrı bir iletişim ortamı oluşturur.

2. Gerçek Zamanlı Sohbet:
- Kullanıcılar, belirledikleri odada gerçek zamanlı olarak mesajlaşabilir.
- Mesajlar, anlık olarak diğer kullanıcılara iletilir ve ekran üzerinde görüntülenir.

3. Kullanıcı Tanıma:
- Her kullanıcının kendine özgü bir kullanıcı adı vardır. Mesajlar, kullanıcı adlarıyla birlikte gösterilir.
- Kullanıcılar, mesajları ve katılımcıları kolayca tanıyabilirler.

4. Kullanıcı Arayüzü:
- React ve Tailwind CSS kullanılarak oluşturulan arayüz, kullanıcı dostu ve şık bir görünüm sunar.
- Giriş ekranı ve sohbet ekranı, kullanıcıların kolayca etkileşimde bulunmasını sağlar.

5. Gerekli Kurumlar

5.1. **Frontend**

```npx create-react-app /yourfolder```

``` npm i socket.io-client```

[Tailwind CSS installation ](https://tailwindcss.com/docs/installation)

5.2. **Backend**

```npx create-react-app /yourfolder```

``` npm i cors express socket.io```



## İstemci Tarafı (React Uygulaması):

**React** kullanılarak modern bir kullanıcı arayüzü oluşturuldu.

**useState** hook'u kullanılarak bileşenler arasında durum yönetimi sağlandı.

**Room.js** bileşeni, kullanıcıdan alınan bilgileri kullanarak sunucuya bağlantı kurdu ve sohbet ekranına yönlendirdi.Kullanıcıdan alınan kullanıcı adı ve oda adıyla sunucuya katılım sağlar.

```javascript
const sendRoom = () => {
		socket.emit('room',room)
		setChatScreen(true)
	};
```

**Chat.js** bileşeni, kullanıcının sohbet ettiği ana bileşen olarak görev yaptı. Socket.IO olaylarını dinleyerek, gelen mesajları yönetti.

```javascript
useEffect(() => {
		socket.on('messageReturn', (data) => {
			setMessageList((prev) => [...prev, data]);
		});
	}, [socket]);

    //Component'in oluşturulması veya güncellenmesi durumunda sunucudan gelen mesajları dinler.
```

```javascript
const sendMesage = async () => {
    const messageContent = {
        username: username,
        message: message,
        room: room,
        date: new Date().getHours() + ':' + new Date().getMinutes(),
    };
    await socket.emit('message', messageContent);
    setMessageList((prev) => [...prev, messageContent]);
    setMessage('');
};


//Kullanıcının girdiği mesajı alır, sunucuya ileterek diğer istemcilere gönderir.
```

Tailwind CSS ile hızlı ve ölçeklenebilir bir tasarım oluşturuldu.

**Socket.IO Client (io.connect):**

**socket.io-client** modülü kullanılarak istemci tarafında sunucuya bağlantı kuruldu.
Bağlantı adresi "http://localhost:5000" olarak belirlendi.


## Sunucu Tarafı (server.js):

**express** kullanılarak hızlı ve minimal bir web sunucusu oluşturuldu.

**cors** middleware'i, Cross-Origin Resource Sharing'i etkinleştirmek için kullanıldı.Bu, farklı domainlerden gelen isteklere izin verir.

**http** modülü kullanılarak basit bir HTTP sunucusu başlatıldı.

**socket.io** modülü, gerçek zamanlı iletişim sağlamak üzere sunucu ve istemci arasında bir WebSocket bağlantısı kurdu.

- Sunucu, http.createServer ile oluşturulan bir HTTP sunucusu üzerinden çalışıyor.socket.io kullanılarak oluşturulan io nesnesi ile sunucu ve istemciler arasında gerçekleşen olayları yönetiyor.

```javascript
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods:['GET','POST']
    }
});
```

**io.on('connection')** ile istemcilerin bağlantılarını dinleyerek, her yeni bağlantı için bir **socket** nesnesi oluşturuldu.
```javascript
io.on('connection', (socket) => {
    console.log('socket.id : ', socket.id);

    socket.on('room', (data) => {
        socket.join(data)
    })

    socket.on('message', (data) => {
        socket.to(data.room).emit('messageReturn',data)
    })
});
```

**socket.on('room')** ile istemcilerin belirli bir odaya katılmasını sağlayan bir olay tanımlandı.

**socket.on('message')** ile istemciden gelen mesajları alarak, aynı odadaki diğer istemcilere iletilmesi sağlandı.
