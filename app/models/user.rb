class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
         has_one_attached :avatar
         has_many :posts


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
