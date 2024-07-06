Rails.application.routes.draw do
  devise_for :users
  resources :posts, only: [:index, :new, :create]
  root 'posts#index'
  resources :users, only: :show
end
