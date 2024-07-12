FactoryBot.define do
  factory :user do
    name {Faker::Name.last_name}
    profile {Faker::Lorem.sentence}
    email {Faker::Internet.email}
    password {Faker::Internet.password(min_length: 6)}
    password_confirmation {password}

    after(:build) do |user|
      user.avatar.attach(io: File.open(Rails.root.join('public', 'images','test_image.png')), filename: 'test_image.png', content_type: 'image/png')
    end
  end
end