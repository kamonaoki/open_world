FactoryBot.define do
  factory :comment do
    text { "MyText" }
    user_id { 1 }
    post_id { 1 }
  end
end
