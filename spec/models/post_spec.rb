require 'rails_helper'

RSpec.describe Post, type: :model do
  before do
    @post = FactoryBot.build(:post)
  end

  describe '投稿' do
    context '投稿できる場合' do
      it '題名と説明と緯度経度と画像が存在していれば保存できる' do
        expect(@post).to be_valid
      end

      it '説明が空でも保存できる' do
        @post.description = ''
        expect(@post).to be_valid
      end
    end

    context '投稿できない場合' do
      it '題名が空では保存できない' do
        @post.title = ''
        expect(@post).to_not be_valid
      end

      it '緯度が空では保存できない' do
        @post.latitude = nil
        expect(@post).to_not be_valid
      end

      it '経度が空では保存できない' do
        @post.longitude = nil
        expect(@post).to_not be_valid
      end

      it '画像が空では保存できない' do
        @post.image = nil
        expect(@post).to_not be_valid
      end

      it 'userが紐付いていないと保存できない' do
        @post.user = nil
        expect(@post).to_not be_valid
      end
    end
  end
end