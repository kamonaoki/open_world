class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

         validates :name, presence: true

         has_one_attached :avatar
         has_many :posts
         has_many :comments


         def avatar_url
           if avatar.attached?
             avatar
           else
             gravatar_url
           end
         end
       
         private
       
         def gravatar_url
           gravatar_id = Digest::MD5::hexdigest(email).downcase
           "https://www.gravatar.com/avatar/#{gravatar_id}"
         end
end
