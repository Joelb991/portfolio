#################### K353 Project by KBK Consulting  ####################
rm(list = ls())
load(url("https://www.dropbox.com/s/g852wf1akx3xljl/airbnb_project.rdata?dl=1"))
library(corrplot)
library(rpart)

################## DATA CLEANING ##################
# Replace rare cancellation policy values with "Strict"
names(table(property_info$CancellationPolicy))
property_info$CancellationPolicy[property_info$CancellationPolicy %in% c("No Refunds","Super Strict 30 Days")] <- "Strict"

# Find which columns have NA Values
na_checker <- apply(property_info, 2, function(x) any(is.na(x)))
col_with_na <- names(na_checker[as.numeric(na_checker) == 1])

# Replace neighborhoods with less than 20 properties with "rare neighborhood"
tb_neighborhood <- table(property_info$Neighborhood)
rare_neighborhood <- names(tb_neighborhood[tb_neighborhood <= 20])
property_info$Neighborhood[property_info$Neighborhood %in% rare_neighborhood] <- "rare neighborhood"
property_info$Neighborhood[is.na(property_info$Neighborhood)] = "rare neighborhood"

# Replace Superhost NA with "unknown host type"
property_info$Superhost[is.na(property_info$Superhost)] <- "unknown host type"

# Clean remaining NA values with median imputation
col_vec_toclean <- col_with_na[!col_with_na %in% c("Neighborhood","Superhost")]
for (i in col_vec_toclean) {
  property_info[[i]][is.na(property_info[[i]])] <- median(property_info[[i]], na.rm = TRUE)
}

################## FEATURE ENGINEERING ##################
# Get Q1 Booked Column
listing_2016Q1_booking <- listing_2016Q1[listing_2016Q1$Status == "R",]
agg_booking_Q1 <- aggregate(Status~PropertyID, data = listing_2016Q1_booking, FUN = length)
colnames(agg_booking_Q1)[2] <- "BookingQ1"
property_info <- merge(x = property_info, y = agg_booking_Q1, by = "PropertyID", all.x=TRUE)
property_info$BookingQ1[is.na(property_info$BookingQ1) == TRUE] <- 0

# Get Q2 Booked Column
listing_2016Q2_booking <- listing_2016Q2[listing_2016Q2$Status == "R",]
agg_booking_Q2 <- aggregate(Status~PropertyID, data = listing_2016Q2_booking, FUN = length)
colnames(agg_booking_Q2)[2] <- "BookingQ2"
property_info <- merge(x = property_info, y = agg_booking_Q2, by = "PropertyID", all.x=TRUE)
property_info$BookingQ2[is.na(property_info$BookingQ2) == TRUE] <- 0

# Get Q1 & Q2 Blocked Day Counts
listing_2016Q1_block <- listing_2016Q1[listing_2016Q1$Status=="B",]
agg_block_Q1 <- aggregate(Status~PropertyID, data=listing_2016Q1_block, FUN=length)
colnames(agg_block_Q1)[2] <- "BlockedQ1"
property_info <- merge(x=property_info, y=agg_block_Q1, by='PropertyID', all.x=TRUE)
property_info$BlockedQ1[is.na(property_info$BlockedQ1)] <- 0

# Get Q2 Average Price
avg_price_Q2 <- aggregate(Price~PropertyID, data=listing_2016Q2, FUN=median)
colnames(avg_price_Q2)[2] <- "AvgPriceQ2"
property_info <- merge(x=property_info, y=avg_price_Q2, by='PropertyID', all.x=TRUE)
property_info$AvgPriceQ2[is.na(property_info$AvgPriceQ2)] <- 0

################## TRAIN / TEST SPLIT ##################
property_info_test <- property_info[property_info$PropertyID %in% PropertyID_test,]
property_info_train <- property_info[!property_info$PropertyID %in% PropertyID_test,]
property_info_train <- merge(property_info_train, reserve_2016Q3_train, by = "PropertyID")

################## EDA — Correlation Matrix ##################
myvars <- c("NumberofReviews", "OverallRating","Longitude",
            "Bathrooms","MaxGuests","ResponseTimemin",
            "SecurityDeposit","CleaningFee","ExtraPeopleFee",
            "PublishedNightlyRate","MinimumStay",
            "NumberofPhotos","BookingQ1","BookingQ2","BlockedQ1","BlockedQ2",
            "NumReserveDays2016Q3","AvgPriceQ2")
property_info_corr <- property_info_train[,myvars]
mydata.cor = cor(na.omit(property_info_corr))

par(bg="beige")
corrplot(mydata.cor, method='ellipse', order = 'AOE', type = 'lower',
         tl.col="#FF5A5F", diag = FALSE, tl.cex = .85,
         addCoef.col = 'black', number.cex = .85)

################### BEST MODEL — Linear Regression (Model 10) ###################
reg1 <- lm(formula = NumReserveDays2016Q3 ~ Superhost + Longitude + BookingQ2 +
             AvgPriceQ2 + NumberofReviews + BlockedQ1 + MaxGuests + BlockedQ2,
           data = property_info_train)
summary(reg1)  # R2 = 0.7325, RSE = 15.86

# Prediction Vector
pred <- predict(object = reg1, newdata = property_info_test)

################### REGRESSION TREE — Best Model ###################
rt = rpart(formula = NumReserveDays2016Q3 ~ BookingQ2 + NumberofReviews +
             BlockedQ1 + MaxGuests + SecurityDeposit + BlockedQ2,
           data = property_info_train, method = "anova")
summary(rt)  # MSE = 16.62