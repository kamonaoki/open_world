Rails.application.routes.draw do
  devise_for :users
  resources :posts
  root 'posts#index'
  resources :users, only: :show
  get 'latest_posts', to: 'posts#latest'
end
