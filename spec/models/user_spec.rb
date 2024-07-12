require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    @user = FactoryBot.build(:user)
  end

  describe 'ユーザー新規登録' do
    context '新規登録できる場合' do
      it "name、profile、email、passwordとpassword_confirmationが存在すれば登録できる" do
        expect(@user).to be_valid
      end

      it "profileはなくても登録できる" do
        @user.profile = ""
        expect(@user).to be_valid
      end
    end

    context '新規登録できない場合' do
      it "nameが空では登録できない" do
        @user.name = ""
        expect(@user).to_not be_valid
      end

      it "emailが空では登録できない" do
        @user.email = ""
        expect(@user).to_not be_valid
      end

      it "passwordが空では登録できない" do
        @user.password = ""
        @user.password_confirmation = ""
        expect(@user).to_not be_valid
      end

        it '重複したemailが存在する場合は登録できない' do
          @user.save
          another_user = FactoryBot.build(:user, email: @user.email)
          another_user.valid?
          expect(another_user.errors.full_messages).to include('Email has already been taken')
        end
  
       it 'emailは@を含まないと登録できない' do
          @user.email = 'testmail'
          @user.valid?
          expect(@user.errors.full_messages).to include('Email is invalid')
       end
      end
    end
  end
