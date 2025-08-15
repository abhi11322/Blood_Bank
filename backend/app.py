from flask import Flask,request,jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app=Flask(__name__)
CORS(app)
app.config['MYSQL_HOST']='localhost'
app.config['MYSQL_USER']='root'
app.config['MYSQL_PASSWORD']='roottoor'
app.config['MYSQL_DB']='blooddb'

mysql=MySQL(app)


@app.route('/')
def index():
    return "hello"

@app.route('/register',methods=['post'])
def register():
    data=request.get_json()
    name=data['name']
    usn=data['usn']
    cur=mysql.connection.cursor()
    cur.execute("INSERT INTO users(name,usn) VALUES(%s,%s)",(name,usn))
    mysql.connection.commit()
    cur.close()
    return "you registered"

@app.route('/login',methods=['POST'])
def login():
    data=request.get_json()
    name=data['name']
    usn=data['usn']
    cur=mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE name=%s AND usn=%s",(name,usn))
    result=cur.fetchall()
    if result:
        return "you logged in"
    else:
        return "invalid credentials"
    
@app.route('/profile_update',methods=['POST'])
def profile_update():
    data=request.get_json()
    usn=data['usn']
    dob=data['dob']
    gender=data['gender']
    bloodgroup=data['bloodgroup']
    contact=data['contact']
    location=data['location']
    role=data['role']
    cur=mysql.connection.cursor()
    cur.execute("UPDATE users SET dob=%s,gender=%s,bloodgroup=%s,contact=%s,location=%s,role=%s where usn=%s",(dob,gender,bloodgroup,contact,location,role,usn))
    mysql.connection.commit()
    cur.close()
    return "profile updated"

@app.route('/get_donar',methods=['POST'])
def get_donar():
    data=request.get_json()
    cur=mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE role='donar' and bloodgroup=%s",(data['bloodgroup'],))
    result=cur.fetchall()
    return jsonify(result)

@app.route('/delete_user',methods=['POST'])
def delete_user():
    data=request.get_json()
    usn=data['usn']
    cur=mysql.connection.cursor()
    cur.execute("DELETE FROM users WHERE usn=%s",(usn,))
    mysql.connection.commit()
    cur.close()
    return "user deleted"

@app.route('/toogledonar',methods=['POST'])
def toogle():
    data=request.get_json()
    usn=data['usn']
    cur=mysql.connection.cursor()
    cur.execute("update users set role=NULL where usn=%s",(usn,))
    mysql.connection.commit()
    cur.close()
    return "user role changed"

@app.route('/setdonar',methods=['POST'])
def setdonar():
    data=request.get_json()
    usn=data['usn']
    cur=mysql.connection.cursor()
    cur.execute("update users set role='donar' where usn=%s",(usn,))
    mysql.connection.commit()
    cur.close()
    return "user role changed"
    

if __name__ == '__main__':
    app.run(debug=True)