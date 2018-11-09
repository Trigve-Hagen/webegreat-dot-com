module.exports = {
  //site_url: 'https://webegreat.com',
  site_url: 'http://localhost:4000',
  chat_url: 'http://localhost:5000',

  per_page: 10,
  
  fallback_folder_name: '',

  facebook_app_id: '',
  facebook_version: '',

  github_client_id: '',
  github_client_secret: '',

  allowed_images: [
    'image/gif',
    'image/jpg',
    'image/jpeg',
    'image/png'
  ],

  allowed_images_magic: [
      { type: 'image/gif', ext: 'gif', magic: '47494638' },
      { type: 'image/jpg', ext: 'jpg', magic: 'ffd8' },
      { type: 'image/jpeg', ext: 'jpeg', magic: 'ffd8' },
      { type: 'image/png', ext: 'png', magic: '89504e47' }
  ]
};