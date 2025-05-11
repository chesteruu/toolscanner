import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tools.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production' 