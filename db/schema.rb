# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161120212541) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "armies", force: :cascade do |t|
    t.integer  "fight_id"
    t.string   "unit_name"
    t.integer  "hp_from"
    t.integer  "hp_to"
    t.integer  "dmg_from"
    t.integer  "dmg_to"
    t.integer  "def_inf_from"
    t.integer  "def_inf_to"
    t.integer  "def_hors_from"
    t.integer  "def_hors_to"
    t.integer  "def_arch_from"
    t.integer  "def_arch_to"
    t.string   "unit_type"
    t.integer  "columns"
    t.integer  "rows"
    t.integer  "x_pos"
    t.integer  "y_pos"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "direction"
    t.integer  "speed"
  end

  create_table "ckeditor_assets", force: :cascade do |t|
    t.string   "data_file_name",               null: false
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.integer  "assetable_id"
    t.string   "assetable_type",    limit: 30
    t.string   "type",              limit: 30
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  add_index "ckeditor_assets", ["assetable_type", "assetable_id"], name: "idx_ckeditor_assetable", using: :btree
  add_index "ckeditor_assets", ["assetable_type", "type", "assetable_id"], name: "idx_ckeditor_assetable_type", using: :btree

  create_table "fights", force: :cascade do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "watched"
    t.text     "description"
  end

  create_table "images", force: :cascade do |t|
    t.string   "name"
    t.text     "file_name"
    t.decimal  "size"
    t.string   "image_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "map_elements", force: :cascade do |t|
    t.integer  "fight_id"
    t.string   "color"
    t.string   "shape"
    t.text     "elements"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "targets", force: :cascade do |t|
    t.integer  "army_id"
    t.integer  "x"
    t.integer  "y"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "stay_time"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "name"
    t.string   "surname"
    t.string   "role"
    t.string   "nickname"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
